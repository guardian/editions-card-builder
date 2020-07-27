import Config from "./config";
import { Furniture } from "../types/furniture";
import { TextRenderer } from "./text-renderer"
import { BylineLocation } from "../enums/location";

const PLACEHOLDER = "PLACEHOLDER";

class CanvasCard {

  imageCache: Map<any,any>;
  furniture?: Furniture;
  drawing: boolean;

  constructor() {
    this.imageCache = new Map();
    this.furniture = undefined;
    this.drawing = false;
  }

  private _getCanvasDimensions({ deviceWidth, deviceHeight, imageWidth, imageHeight }:
     { deviceWidth: number, deviceHeight: number, imageWidth: number, imageHeight: number }) {
    //For each unit of width, the image has this height
    const deviceRatio = deviceWidth / deviceHeight;
    const imageRatio = imageWidth / imageHeight;
    if (deviceRatio < imageRatio) {
      return {
        width: imageHeight * deviceRatio,
        height: imageHeight,
        scale: imageHeight / deviceHeight
      };
    }
    return {
      width: imageWidth,
      height: imageWidth / deviceRatio,
      scale: imageWidth / deviceWidth
    };
  }

  private _drawImage({ canvasContext, image }: { canvasContext: CanvasRenderingContext2D, image: HTMLImageElement }) {
    const x = 0;
    const y = 0;
    const xOffset = 0.5;
    const yOffset = 0.5;

    const canvasWidth = canvasContext.canvas.width;
    const canvasHeight = canvasContext.canvas.height;

    const imageWidth = image.width;
    const imageHeight = image.height;

    const ratio = Math.min(
      canvasWidth / imageWidth,
      canvasHeight / imageHeight
    );

    const width = imageWidth * ratio;
    const height = imageHeight * ratio;

    // decide which gap to fill
    let ar = 1;
    if (width < canvasWidth) {
      ar = canvasWidth / width;
    }
    if (Math.abs(ar - 1) < 1e-14 && height < canvasHeight) {
      ar = canvasHeight / height;
    }

    const nw = width * ar;
    const nh = height * ar;

    // calc source rectangle
    const cw = imageWidth / (nw / canvasWidth);
    const ch = imageHeight / (nh / canvasHeight);

    const cx = (imageWidth - cw) * xOffset;
    const cy = (imageHeight - ch) * yOffset;

    canvasContext.drawImage(
      image,
      cx < 0 ? 0 : cx,
      cy < 0 ? 0 : cy,
      Math.min(cw, imageWidth),
      Math.min(ch, imageHeight),
      x,
      y,
      canvasWidth,
      canvasHeight
    );
  }

  private _drawKickerAndHeadline(headlineRenderer: TextRenderer, canvas: HTMLCanvasElement, furniture: Furniture, scale: number, availableHeight: number){
    //Split kicker into multiple lines
    const splitKicker = headlineRenderer.splitTextIntoLines(furniture.kicker as string);
    const lastKickerLine = splitKicker[splitKicker.length - 1];

    //split split kicker last line and rest of headline
    const splitHeadlineAndKicker = headlineRenderer.splitTextIntoLines(`${lastKickerLine} ${furniture.headline}`);

    const lineHeight =
      (Config.headline[furniture.device].lineHeight[furniture.headlineSize]) *
      scale;

    //Do last split kick and first headline fit together on a line?
    const fristHeadline = splitHeadlineAndKicker[0]
    const firstHeadlineMinusKicker = splitHeadlineAndKicker[0].substr(lastKickerLine.length, fristHeadline.length);
    const kickerAndHeadlineisMixed = headlineRenderer.doesTextFit(`${lastKickerLine.trim()} ${firstHeadlineMinusKicker.trim()}`) && fristHeadline.length != lastKickerLine.length;

    //If yes
    if(kickerAndHeadlineisMixed){
      const lineCount = splitKicker.length + splitHeadlineAndKicker.length - 1;
      //render all lines but last
      if(splitKicker.length > 1){
        const kickerOffset = availableHeight * furniture.position / 100;
        headlineRenderer.drawText(splitKicker.slice(0, splitKicker.length - 1), 0, kickerOffset, furniture.kickerColour);
      }

      //Render last kicker line
      const lastKickerOfest = availableHeight * furniture.position / 100 + (lineHeight * (splitKicker.length - 1));
      headlineRenderer.drawText([lastKickerLine], 0, lastKickerOfest, furniture.kickerColour);

      //Render rest of rest of first headline
      const xOffset = headlineRenderer.measureTextWidth(lastKickerLine);
      headlineRenderer.drawText([firstHeadlineMinusKicker],xOffset, lastKickerOfest,furniture.headlineColour);

      //Render rest of headline lines
      if(splitHeadlineAndKicker.length > 1) {
        const headlineOffset = availableHeight * furniture.position / 100 + (lineHeight * splitKicker.length);
        headlineRenderer.drawText(splitHeadlineAndKicker.slice(1, splitHeadlineAndKicker.length), 0, headlineOffset, furniture.headlineColour);
      }
    }
    //If No
    else {
      const lineCount = splitKicker.length + splitHeadlineAndKicker.length - 1;
      //Render kicker lines
      const kickerOffset = availableHeight * furniture.position / 100;
      headlineRenderer.drawText(splitKicker, 0, kickerOffset, furniture.kickerColour);

      //Render headline lines
      const headlineOffset = availableHeight * furniture.position / 100 + (lineHeight * splitKicker.length);
      headlineRenderer.drawText(splitHeadlineAndKicker.slice(1, splitHeadlineAndKicker.length), 0, headlineOffset, furniture.headlineColour);
    }
  }

  private _drawFurniture(canvas: HTMLCanvasElement, canvasContext: CanvasRenderingContext2D, furniture: Furniture, scale: number){

    const headlineAndKickerRenderer = new TextRenderer({
      canvasContext,
      maxWidth: Config.headline[furniture.device].maxWidth * scale,
      font: Config.headline.font,
      fontSize: Config.headline[furniture.device].fontSize[furniture.headlineSize] * scale,
      lineHeight: Config.headline[furniture.device].lineHeight[furniture.headlineSize] * scale,
      scale: scale,
      padding: Config.padding
    });

    const standfirstRenderer = new TextRenderer({
      canvasContext,
      maxWidth: Config.standfirst[furniture.device].maxWidth * scale,
      font: Config.standfirst.font,
      fontSize: Config.standfirst[furniture.device].fontSize[furniture.standfirstSize] * scale,
      lineHeight: Config.standfirst[furniture.device].lineHeight[furniture.standfirstSize] * scale,
      scale: scale,
      padding: Config.padding
    });

    const bylineRenderer = furniture.bylineLocation == BylineLocation.Headline ?
      new TextRenderer({
        canvasContext,
        maxWidth: Config.headline[furniture.device].maxWidth * scale,
        font: Config.standfirst.font,
        fontSize: Config.headline[furniture.device].fontSize[furniture.headlineSize] * scale,
        lineHeight: Config.headline[furniture.device].lineHeight[furniture.headlineSize] * scale,
        scale: scale,
        padding: Config.padding
      }) :
      new TextRenderer({
        canvasContext,
        maxWidth: Config.standfirst[furniture.device].maxWidth * scale,
        font: Config.standfirst.font,
        fontSize: Config.standfirst[furniture.device].fontSize[furniture.standfirstSize] * scale,
        lineHeight: Config.standfirst[furniture.device].lineHeight[furniture.standfirstSize] * scale,
        scale: scale,
        padding: Config.padding
      }) ;

    const kickerAndHeadlineText = `${furniture.kicker ? furniture.kicker + " " : ""}${furniture.headline || ""}`

    const splitHeadlineAndKicker = !furniture.headline && !furniture.kicker ? [] : headlineAndKickerRenderer.splitTextIntoLines(kickerAndHeadlineText);
    const splitStandfirst = !furniture.standfirst ? [] : standfirstRenderer.splitTextIntoLines(furniture.standfirst);
    const splitByline = !furniture.byline ? [] : bylineRenderer.splitTextIntoLines(furniture.byline);

    const paddingHeight = Config.padding * scale;
    const headlineHeight = splitHeadlineAndKicker.length * headlineAndKickerRenderer.lineHeight;
    const standfirstHeight = splitStandfirst.length * standfirstRenderer.lineHeight;
    const bylineHeight = splitByline.length * bylineRenderer.lineHeight;

    const availableHeight = canvas.height - bylineHeight - standfirstHeight - headlineHeight - paddingHeight;


    if(!!furniture.headline && !!furniture.kicker){
      this._drawKickerAndHeadline(headlineAndKickerRenderer, canvas, furniture, scale, availableHeight);
    }
    else if (!!furniture.headline) {
      const splitHeadline = headlineAndKickerRenderer.splitTextIntoLines(furniture.headline);
      const headlineOffset = availableHeight * furniture.position / 100;
      headlineAndKickerRenderer.drawText(splitHeadline, 0, headlineOffset, furniture.headlineColour);
    }
    else if(!!furniture.kicker) {
      const splitKicker = headlineAndKickerRenderer.splitTextIntoLines(furniture.kicker);
      const kickerOffset = availableHeight * furniture.position / 100;
      headlineAndKickerRenderer.drawText(splitKicker, 0, kickerOffset, furniture.kickerColour);
    }

    if (splitStandfirst.length > 0) {
      const additionalOffset = furniture.bylineLocation == BylineLocation.Headline ? bylineHeight : 0;
      const standfirstOffset = availableHeight * furniture.position / 100 + headlineHeight + paddingHeight + additionalOffset;
      standfirstRenderer.drawText(splitStandfirst, 0, standfirstOffset, furniture.standfirstColour);
    }

    if (splitByline.length > 0) {
      const additionalOffset = furniture.bylineLocation == BylineLocation.Standfirst ? standfirstHeight + paddingHeight : 0;
      const bylineOffset = availableHeight * furniture.position / 100 + headlineHeight + additionalOffset;
      bylineRenderer.drawText(splitByline, 0, bylineOffset, furniture.bylineColour);
    }
  }

  private _getImageDataUrl(imageUrl: string) : Promise<string> {
    const key = encodeURIComponent(imageUrl);
    const maybeItem = this.imageCache.get(key);

    if (maybeItem) {
      if(maybeItem != PLACEHOLDER){
        return Promise.resolve(maybeItem);
      }
      else{
        return Promise.reject();
      }
    }
    else {
      this.imageCache.set(key, PLACEHOLDER);
    }

    return fetch(imageUrl)
      .then(res => res.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      )
      .then(dataUrl => {
        this.imageCache.set(key, dataUrl);
        return dataUrl as string;
      });
  }

  private _getImage(imageUrl: string) {
    return this._getImageDataUrl(imageUrl).then(
      (dataUrl: string) =>
        new Promise<HTMLImageElement>(resolve => {
          const image = new Image();
          image.addEventListener("load", _ => resolve(image));
          image.src = dataUrl;
        })
    );
  }

  draw(
    canvas: HTMLCanvasElement,
    furniture: Furniture
   ) {
    if (!furniture.imageUrl) {
      return Promise.reject("no-image");
    }

    this.furniture = furniture;

    if (this.drawing) {
      return Promise.reject("already-drawing");
    }

    this.drawing = true;

    return this._getImage(furniture.imageUrl).then(image => {
      if(!this.furniture){
        return Promise.reject();
      }

      const [deviceWidth, deviceHeight] = Config.dimensions[this.furniture.device];

      const { width, height, scale } = this._getCanvasDimensions({
        deviceWidth,
        deviceHeight,
        imageHeight: image.height,
        imageWidth: image.width
      });

      canvas.width = width;
      canvas.height = height;

      const canvasContext = canvas.getContext("2d");

      if(canvasContext){
        this._drawImage({ canvasContext, image });
        this._drawFurniture(canvas, canvasContext, this.furniture, scale)
      }
    })
    .finally(
      () => this.drawing = false
    );
  }
}

export default CanvasCard;
