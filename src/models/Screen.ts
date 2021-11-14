import { isNotNullish } from "./util";
import { Presentation } from "@/models/Presentation";

export class Screen {
  readonly id!: string;
  readonly name!: string;
  displayPresentationRef?: Pick<Presentation, "id">;

  private presentation?: Presentation;

  constructor(init: Partial<Screen>) {
    Object.assign(this, init);
  }

  static canDeserialize?(data: unknown): data is Screen {
    if (!isNotNullish(data)) {
      return false;
    }
    return typeof data.id === "string" && typeof data.name === "string";
  }

  serialize?(): unknown {
    const result = Object.assign({}, this);
    delete result.presentation;
    return result;
  }

  setPresentation(presentation: Presentation): void {
    this.presentation = presentation;
  }

  getPresentation(): Presentation {
    return this.presentation;
  }
}
