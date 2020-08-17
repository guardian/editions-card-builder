import { FontWeight } from "../enums/font-weight";

export class TextRenderer {

  constructor({canvasContext, maxWidth, font, fontSize, lineHeight, scale, padding, weight} :
    {canvasContext: CanvasRenderingContext2D, maxWidth: number, font: string, fontSize: number, lineHeight: number, scale: number, padding: number, weight: string }){
    this.canvasContext = canvasContext;
    this.maxWidth = maxWidth;
    this.font = font;
    this.fontSize = fontSize;
    this.lineHeight = lineHeight;
    this.scale = scale;
    this.padding = padding;
    this.weight = weight;
  }

  canvasContext: CanvasRenderingContext2D;
  maxWidth: number;
  font: string;
  fontSize: number;
  lineHeight: number;
  scale: number;
  padding: number;
  weight: string;

  doesTextFit(text: string) {
    const measure = this.canvasContext.measureText(text);
    return measure.width < this.maxWidth;
  }

  splitTextIntoLines(text: string): string[] {
    this.canvasContext.font = `${this.fontSize}px ${this.font}`;

    const measured = text.split("").reduce(
      ({ buffer, lines }: {buffer: string, lines: any}, char: string) => {
        const newBuffer = buffer + char;
        //Are we on a newline?
        if (char === "\n") {
          return { lines: [...lines, buffer], buffer: "" };
        }
        //Does the text fit ok?
        if (this.doesTextFit(newBuffer)) {
          return { lines: lines, buffer: newBuffer };
        }

        //Can we split at a space?
        const lastSpace = newBuffer.lastIndexOf(" ");
        if (lastSpace !== -1) {
          const left = newBuffer.substring(0, lastSpace);
          const right = newBuffer.substring(lastSpace + 1);
          return {
            lines: [...lines, left],
            buffer: right
          };
        }
        return { lines: [...lines, buffer], buffer: char };
      },
      { buffer: "", lines: [] }
    );

    return [...measured.lines, measured.buffer];
  }

  measureTextWidth(text: string){
    return this.canvasContext.measureText(text).width;
  }

  drawText(
    lines: string[],
    initialXOffset: number,
    initialYOffset: number,
    colour: string
  ) {
    this.canvasContext.font = `${this.weight} ${this.fontSize}px ${this.font}`;
    this.canvasContext.fillStyle = colour;
    this.canvasContext.textBaseline = "bottom";
    lines.forEach((line, i) => {
      const xOffset = this.padding * this.scale + initialXOffset
      const yOffset = initialYOffset + this.lineHeight * (i + 1);
      this.canvasContext.fillText(line, xOffset, yOffset);
    });
  }

}
