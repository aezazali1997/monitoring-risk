import { google } from "googleapis";
import { DateUtils } from '../utils/Date-utils'
import countriesData from '../utils/countries-data.json'
export class GoogleAnalyticsDataApi {

  private auth: any
  private propertyId: string = '';
  private analyticsDataApi: any

  constructor() {
    this.auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY,
      ['https://www.googleapis.com/auth/analytics.readonly'],
      undefined
    )
    this.setConfigs();
  }
  // only to be used when initializing class
  private setConfigs() {
    this.propertyId = process.env.GOOGLE_GA4_PROPERTY_ID || ''
    this.analyticsDataApi = google.analyticsdata({ version: 'v1beta', auth: this.auth });

  }
  public getCountires = async (startDate: string, endDate: string) => {
    try {
      const response = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'country' }, { name: 'countryId' }],
          metrics: [{ name: 'eventCount' }],
        },
      });
      const countryData = response.data.rows!.map((row: any) => {
        let countryCode = row.dimensionValues![1].value as string
        return {
          country: row.dimensionValues![0].value,
          image: countriesData[`${countryCode as keyof typeof countriesData}`].image,
          users: row.metricValues![0].value
        };
      });

      return countryData

    } catch (error) {
      console.error('Error retrieving analytics data:', error);

    }

  }
  public getCitiesReport = async (startDate: string, endDate: string) => {


    try {
      const response = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody:
        {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'eventCount' }],
          dimensions: [{ name: 'city' }]

        },
      });
      const cityUserData = response.data.rows!.map((row: any) => {
        return { city: row.dimensionValues![0].value, users: row.metricValues![0].value };
      });
      return cityUserData;
    } catch (err) {
      console.error('Error retrieving analytics data:', err);
    }
  }

  public getWebsiteViews = async (startDate: string, endDate: string) => {
    try {
      const response = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {

          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'eventCount' }],
        }
      });
      // The response will contain the total number of views for the specified date range.
      const rows = response.data.rows;
      const totalViews = rows!.reduce(
        (totalViews: any, row: any) => totalViews + parseInt(row.metricValues![0].value!),
        0
      );

      // `totalViews` will now contain the total number of views for the specified date range.
      return { totalViews };
    } catch (err) {
      console.error('Error retrieving analytics data:', err);
    }
  }
  public getMobileDesktopPercentage = async (startDate: string, endDate: string) => {
    try {
      const response = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'activeUsers' }],
          dimensions: [{ name: 'deviceCategory' }],
        }
      });
      const rows = response.data.rows;

      let desktopUsers = 0;
      let mobileUsers = 0;
      let tabletUsers = 0;

      rows!.forEach((row: any) => {
        const dimensionValue = row.dimensionValues![0].value!.toLowerCase();
        const metricValue = parseInt(row.metricValues![0].value!);

        if (dimensionValue === 'desktop') {
          desktopUsers = metricValue;
        } else if (dimensionValue === 'mobile') {
          mobileUsers = metricValue;
        }
        else if (dimensionValue === 'tablet') {
          tabletUsers = metricValue;
        }
      });

      return { desktopUsers, tabletUsers, mobileUsers };

    } catch (err) {
      console.error('Error retrieving analytics data:', err);
    }
  }
  public getList = async (startDate: string, endDate: string) => {

    const propertyConfigurations = [
      {
        dateRanges: [{ startDate, endDate }],
        metrics: [{ name: 'averageSessionDuration' }, { name: 'newUsers' }],
        dimensions: [
          { name: 'country' },
          { name: 'countryId' },
          { name: 'city' },
          { name: 'deviceCategory' },
          { name: 'operatingSystem' },
        ],
      }
    ]

    try {
      // Fetch data for each view configuration and store the results in an array.
      const results = await Promise.all(
        propertyConfigurations.map(async (config) => {
          const { data } = await this.analyticsDataApi.properties.runReport({
            property: `properties/${this.propertyId}`,
            requestBody: {
              dateRanges: config.dateRanges,
              metrics: config.metrics,
              dimensions: config.dimensions,
            },
          });

          // Parse the response data and convert it to the desired format.
          const formattedData = data.rows!.map((row: any) => {
            const [country, countryId, city, deviceCategory, operatingSystem,] = row.dimensionValues!.map(
              (value: any) => value.value
            );
            const [averageSessionDuration, newUsers] = row!.metricValues!.map((value: any) => value.value)
            const image = countriesData[`${countryId as keyof typeof countriesData}`].image

            return {
              country,
              flag: image,
              city,
              deviceCategory,
              operatingSystem,
              averageSessionDuration,
              newUsers,
            };
          });

          return formattedData;
        })
      );
      return results;
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  public maleVsFemale = async (startDate: string, endDate: string) => {


    const maleRequest = {
      dateRanges:
        [{ startDate, endDate }]
      ,
      dimensions: [
        {
          name: 'userGender',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'userGender',
          stringFilter: {
            value: 'Male',
          },
        },
      },
    };

    const femaleRequest = {
      dateRanges:
        [{ startDate, endDate }]
      ,
      dimensions: [
        {
          name: 'userGender',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'userGender',
          stringFilter: {
            value: 'Female',
          },
        },
      },
    };


    try {

      const maleResponse = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: maleRequest,
      });
      const femaleResponse = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: femaleRequest,
      });

      let maleUsersData = 0
      let maleUsersCount = 0
      let femaleUsersData = 0
      let femaleUsersCount = 0


      if (maleResponse.data.rows) {
        const maleUsersData = maleResponse.data.rows![0];
        const maleUsersCount = parseInt(maleUsersData.metricValues![0].value!);

      }
      if (femaleResponse.data.rows) {
        const femaleUsersData = femaleResponse.data.rows![0];
        const femaleUsersCount = parseInt(femaleUsersData.metricValues![0].value!);

      }

      return { maleUsersCount, femaleUsersCount };
    }
    catch (error) {
      console.error('An error occurred:', error);

    }

  }

  public AgeStats = async (startDate: string, endDate: string) => {

    try {
      const { data } = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'newUsers' }],
          dimensions: [{ name: 'userAgeBracket' }],
        },
      });
      // Create a mapping for age brackets returned by Google Analytics to the desired age brackets
      const ageBracketMap: { [key: string]: string } = {
        '18-24': '18-24',
        '25-34': '25-34',
        '35-44': '35-44',
        '45-54': '45-54',
        '55-64': '55+',
        '65+': '55+', // Combine 65+ with 55+ in the same category
      };

      // Provided age brackets
      const ageBrackets = ['18-24', '25-34', '35-44', '45-54', '55+'];

      // Initialize ageData object with all age brackets set to 0
      const ageData = ageBrackets.reduce((result: { [key: string]: number }, bracket) => {
        result[bracket] = 0;
        return result;
      }, {});

      if (data.rows) {
        // Update ageData with values from Google Analytics data
        data.rows.forEach((row: any) => {
          const ageBracket = row.dimensions![0];
          const usersCount = parseInt(row.metrics![0].values![0], 10);

          // Map the age bracket to the desired format using the ageBracketMap
          const name = ageBracketMap[ageBracket];

          // Add the usersCount to the corresponding age group
          if (name) {
            ageData[name] = usersCount;
          }
        });
      }

      // Convert the ageData object to the final array format
      const finalAgeData = Object.keys(ageData).map((name) => ({ name, value: ageData[name] }));

      return finalAgeData;
    } catch (error) {
      console.error('Error retrieving analytics data:', error);
      return [];
    }
  }
  public getTotalUsers = async (startDate: string, endDate: string) => {
    const request = {
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
      dimensions: [
        {
          name: 'newVsReturning'
        }
      ]
    };

    try {
      const { data } = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: request,

      });
      let totalUsers = 0;
      if (data.rows) {
        data.rows.forEach((row: any) => {
          if (row.dimensionValues[0].value !== '(not set)') {
            totalUsers += +row.metricValues[0].value
          }
        })

      }
      return { totalUsers };
    } catch (error) {
      console.error('An error occurred:', error);
      return null;
    }
  }
  public usersVSMonth = async (startDate: string, endDate: string) => {

    try {
      const { data } = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [
            {
              startDate,
              endDate,
            },
          ],
          metrics: [
            {
              name: 'activeUsers',
            },
          ],
          dimensions: [
            {
              name: 'yearMonth'
            },
          ]
        }
      });
      const return_data = data.rows!.map((row: any) => {
        const dimensions = row.dimensionValues;
        const metrics = row.metricValues![0].value;
        const yearMonth = dimensions![0].value!.replace(/(\d{4})(\d{2})/, '$1-$2');
        return {
          yearMonth,
          users: parseInt(metrics!, 10),
        };
      });
      return_data.sort((a: any, b: any) => (a.yearMonth > b.yearMonth ? 1 : -1));

      return return_data;
    } catch (error) {
      console.error('An error occurred:', error);
      return null;
    }
  }
  public uniqueVisitors = async (startDate: string, endDate: string) => {

    const request = {
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
      dimensions: [
        {
          name: 'newVsReturning'
        }
      ]
    };
    try {
      let unique: any;
      const { data } = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: request,
      });
      data.rows?.map((row: any) => {
        if (row.dimensionValues![0].value === 'new') {
          unique = row.metricValues![0].value
        }
      })
      return {
        unique
      };
    }
    catch (error) {
      console.error('An error occurred:', error);

    }
  }

  public uniqueVsReturningVisitors = async (startDate: string, endDate: string) => {

    try {
      let unique = 0;
      let returning = 0
      const { data } = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [
            {
              startDate,
              endDate
            }
          ],
          metrics: [
            {
              name: 'activeUsers'
            }
          ],
          dimensions: [
            {
              name: 'newVsReturning'
            }
          ]
        }
      });
      if (data.rows) {
        data.rows.map((row: any) => {
          if (row!.dimensionValues![0].value === 'new') {
            unique = +(row!.metricValues![0].value!)
          }
          if (row!.dimensionValues![0].value === 'returning') {
            returning = +(row!.metricValues![0].value!)
          }
        })
      }
      return {
        unique,
        returning
      }
    }
    catch (error) {
      console.error('An error occurred:', error);
    }
  }
  public last30Minute = async () => {
    try {
      const { data } = await this.analyticsDataApi.properties.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          metrics: [
            {
              name: 'activeUsers', // Use 'activeUsers' metric to get the number of users for the specified date range
            },
          ],
          minuteRanges: [
            {
              startMinutesAgo: 29,
              endMinutesAgo: 0
            }
          ]

        },
      });
      let last30MinuteUsers = 0
      if (data.rows) {
        last30MinuteUsers = data.rows[0].metricValues[0].value;

      }
      return { last30MinuteUsers };
    } catch (error) {
      console.error('An error occurred:', error);
      return null;
    }
  }
  public averageEngagementTime = async (startDate: string, endDate: string) => {
    try {

      const response = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [
            {
              startDate: startDate,
              endDate: endDate,
            },
          ],
          metrics: [
            {
              name: 'userEngagementDuration',

            },
          ]
        },
      });

      const averageEngagementTime = response.data.rows[0].metricValues[0].value
      return {
        averageEngagementTime
      }
    } catch (error) {
      console.error('Error retrieving analytics data:', error);
    }
  }
  public getMostViewedPages = async (startDate: string, endDate: string) => {
    try {
      const response = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [
            {
              startDate: startDate,
              endDate: endDate,
            },
          ],
          dimensions: [
            {
              name: 'pagePath',
            },
          ],
          metrics: [
            {
              name: 'screenPageViews',
            },
          ],

        },
      });


      const pages = response.data.rows.map((row: any) => ({
        pagePath: row.dimensionValues[0].value === '/' ? 'home' : row.dimensionValues[0].value,
        views: row.metricValues[0].value,
      }));
      // Sort the pages by views in descending order
      const sortedPages = pages.sort((a: any, b: any) => b.views - a.views);

      // Get the top 3 most viewed pages



      return {
        mostViewedPages: sortedPages
      }
    } catch (error) {
      console.error('Error retrieving analytics data:', error);
    }
  }
  public getUserInterests = async (startDate: string, endDate: string) => {
    let interests = [
      {
        interest: '',
        activeUsers: 0
      }
    ]
    try {
      const response = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {

          dateRanges: [
            {
              startDate: startDate,
              endDate: endDate,
            }
          ],
          dimensions: [
            { name: 'brandingInterest' }
          ],
          metrics: [
            { name: 'activeUsers' }
          ],
          limit: 10, // Limit the result to the top 10 user interests
        }
      });

      if (response.data.rows) {
        interests = response.data.rows[0].map((row: any) => ({
          interest: row.dimensionValues[0],
          activeUsers: row.metricValues[0].value,
        }));
      }


      return interests;
    } catch (error) {
      console.error('Error retrieving analytics data:', error);
      return interests;
    }
  }
}