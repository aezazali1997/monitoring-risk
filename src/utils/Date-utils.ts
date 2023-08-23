export class DateUtils {

    /**
 * Extracts the date in the format 'YYYY-MM-DD' from the input date string or Date object.
 * If the input is a Date object, it will be converted to a string before extraction.
 *
 * @param {string|Date} date - The date string or Date object from which to extract the date.
 * @returns {string} The extracted date in the format 'YYYY-MM-DD'.
 *
 * @example
 * const date1 = '2023-07-30T10:15:25Z';
 * const date2 = new Date('2023-07-30T10:15:25Z');
 *
 * const extractedDate1 = extractDateInYYYYMMDD(date1);
 * console.log(extractedDate1); // Output: '2023-07-30'
 *
 * const extractedDate2 = extractDateInYYYYMMDD(date2);
 * console.log(extractedDate2); // Output: '2023-07-30'
 */

    extractDateInYYYYMMDD = (date: string | Date) => {

        let localDate = date.toString();

        let splitedDate = localDate.split('T');
        return splitedDate[0];
    }

}



