export class GeneralUtils {
  static sortOrderDictionary = new Map<number, string>().set(1, 'asc').set(-1, 'desc');

  static stripPhoneNumbers(phoneNumber: string) {
    if (phoneNumber) {
      return phoneNumber.replace(/\D/g, '');
    } else {
      return '';
    }
  }

  static getTextFromSelectOneElement(elementId) {
    const elt = document.getElementById(elementId);

    if (elt['selectedIndex'] === -1) { return null; }

    return elt['options'][elt['selectedIndex']].text;
  }
}
