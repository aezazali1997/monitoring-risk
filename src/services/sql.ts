import { config } from 'dotenv'
import { createConnection } from 'mysql2';
import dns from 'dns';
// @ts-ignore
import { subdivision } from 'iso-3166-2';
// @ts-ignore
import geoip from 'geoip-lite';
import { countries } from 'countries-list';
import countriesData from '../utils/countries-data.json'
config();

export class SQLService {
    private static instance: SQLService
    connection: any;
    constructor() {
        try {
            this.connection = createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME

            })

        } catch (error) {
            console.log('Could not connect to SQL')
        }

    }
    static init() {
        if (!SQLService.instance) {
            SQLService.instance = new SQLService();
        }

        return SQLService.instance;
    }
    public async getAllIP(pageNumber: number = 1, pageSize: number = 15, startDate: Date, endDate: Date) {
        try {
            const client = this.connection;
            const offset = (pageNumber - 1) * pageSize;
            const query = `SELECT * FROM ip_address WHERE created_at >= ? AND created_at <= ? LIMIT ? OFFSET ?`;

            const results: any[] = await new Promise((resolve, reject) => {
                client.query(query, [startDate, endDate, pageSize, offset], (err: any, results: any) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });

            const data = await Promise.all(results.map(async (item: any) => {
                const serviceProvider = await this.getDNS(item.ip_addres);
                let country;
                let region;
                let city;
                let ll;
                let timezone;
                let range;
                let proxy;
                let mobile;
                let isp;
                let organization;
                const geo = geoip.lookup(item.ip_addres)
                if (geo) {
                    country = geo.country,
                        region = geo.region
                    city = geo.city
                    ll = geo.ll
                    timezone = geo.timezone
                    range = geo.range
                    proxy = geo.proxy
                    mobile = geo.mobile
                    isp = geo.isp
                    organization = geo.organization

                }
                return {
                    IpAddress: item.ip_addres,
                    ServiceProvider: serviceProvider,
                    country: this.getCountryName(country),
                    flag: geo ? countriesData[`${geo.country as keyof typeof countriesData}`]?.image : "",
                    countryCode: country,
                    region: this.getRegionName(country, region),
                    city,
                    ll,
                    timezone,
                    range,
                    proxy,
                    mobile,
                    isp,
                    organization,
                    date: item.created_at
                };
            }));

            return data
        } catch (error) {
            console.error('Error retrieving IP data:', error);
            return [];
        }
    }

    public bestAudio = async () => {

        try {
            const client = this.connection;
            const query = `SELECT * FROM trackers WHERE type='Audio'`;
            const results: any[] = await new Promise((resolve, reject) => {
                client.query(query, (err: any, results: any) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
            let data = this.calculateFrequency(results);
            return {
                mostFamousAudio: Object.keys(data)[0],
                Views: Object.values(data)[0]
            }


        } catch (error) {

        }
    }
    public bestArticle = async () => {

        try {
            const client = this.connection;
            const query = `SELECT * FROM trackers WHERE type='Article'`;
            const results: any[] = await new Promise((resolve, reject) => {
                client.query(query, (err: any, results: any) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
            let data = this.calculateFrequency(results);
            return {
                mostFamousArticle: Object.keys(data)[0],
                Views: Object.values(data)[0]
            }


        } catch (error) {

        }
    }
    public getAllContent = async (startDate: any, endDate: any, type: any) => {
        try {
            const client = this.connection;
            let query = '';
            let queryParams: any = [];

            if (type) {
                query = `SELECT id, type, title, COUNT(*) AS count, MIN(created_at) AS created_at, MAX(updated_at) AS updated_at 
                         FROM trackers 
                         WHERE type=?`;
                queryParams.push(type);
            } else {
                query = `SELECT id, type, title, COUNT(*) AS count, MIN(created_at) AS created_at, MAX(updated_at) AS updated_at 
                         FROM trackers`;
            }

            if (startDate && endDate) {
                query += ' AND created_at >= ? AND created_at <= ?';
                queryParams.push(startDate, endDate);
            }

            query += ' GROUP BY title';

            const results: any[] = await new Promise((resolve, reject) => {
                client.query(query, queryParams, (err: any, results: any) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });

            return results;
        } catch (error) {
            console.log('Error:', error);
            throw error;
        }
    }
    public async getServiceProviderForIP(ipAddress: string): Promise<string> {
        try {
            const hostnames = await dns.promises.reverse(ipAddress);
            const serviceProvider = hostnames[0] || 'Unknown';
            return serviceProvider;
        } catch (error) {
            return 'Unknown';
        }
    }
    public async getDNS(ipAddress: string) {
        try {
            const response = await this.getServiceProviderForIP(ipAddress);
            return response;
        } catch (error) {
            return error;
        }
    }

    getCountryName(countryCode: string) {
        // @ts-ignore
        return countries[countryCode] || 'Unknown';
    }
    // Function to get the full region name from the region code
    getRegionName(countryCode: string, regionCode: string) {
        const key = `${countryCode}-${regionCode}`;
        return subdivision(key) || regionCode;
    }
    public calculateFrequency = (arr: any) => {
        const countArray: any = {}

        arr.forEach((content: any) => {
            const { title } = content
            countArray[title] = (countArray[title] || 0) + 1
        })


        const frequencyArray = Object.entries(countArray);

        frequencyArray.sort((a: any, b: any) => b[1] - a[1]);

        const sortedFrequencyMap = Object.fromEntries(frequencyArray);

        return sortedFrequencyMap;
    }
}