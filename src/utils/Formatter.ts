import moment from "moment";

export class Formatter {
  static formatDate(date: Date) {
    return moment(date).format("YYYY/MM/DD（ddd）");
  }
  static formatDateTime(date: Date) {
    return moment(date).format("YYYY/MM/DD HH:mm");
  }
}
