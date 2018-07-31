export class GeneralUtils {
  static sortOrderDictionary = new Map<number, string>().set(1, 'asc').set(-1, 'desc');

  static stripPhoneNumbers(phoneNumber: string) {
    if (phoneNumber) {
      return phoneNumber.replace(/\D/g, '');
    } else {
      return '';
    }
  }
}
