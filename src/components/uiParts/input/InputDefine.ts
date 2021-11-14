export class SelectItem {
  public readonly text!: string;
  public readonly value!: string;

  constructor(text: string, value: string) {
    this.text = text;
    this.value = value;
  }
}
