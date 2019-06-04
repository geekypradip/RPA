import { IAnnotation } from "Annotation";

export interface IShapeData {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IRectShapeData extends IShapeData {
  type: "RECT";
}

export interface IShape {
  onDragStart: (positionX: number, positionY: number) => void;
  onDrag: (positionX: number, positionY: number) => void;
  checkBoundary: (positionX: number, positionY: number) => boolean;
  paint: (canvas2D: CanvasRenderingContext2D, selected: boolean) => void;
  getAnnotationData: () => IAnnotation;
  adjustMark: ({ width, height }: { width: number; height: number }) => void;
}

export class RectShape implements IShape {
  private annotationData: IAnnotation<IRectShapeData>;

  private onChangeCallBack: () => void;

  private dragStartOffset: { offsetX: number; offsetY: number };

  constructor(data: IAnnotation<IRectShapeData>, onChange: () => void) {
    this.annotationData = data;
    this.onChangeCallBack = onChange;
  }

  public onDragStart = (positionX: number, positionY: number) => {
    const { x, y } = this.annotationData.mark;
    this.dragStartOffset = { offsetX: positionX - x, offsetY: positionY - y };
  };

  public onDrag = (positionX: number, positionY: number) => {
    this.annotationData.mark.x = positionX - this.dragStartOffset.offsetX;
    this.annotationData.mark.y = positionY - this.dragStartOffset.offsetY;
    this.onChangeCallBack();
  };

  public checkBoundary = (positionX: number, positionY: number) => {
    const {
      mark: { x, y, width, height }
    } = this.annotationData;

    if (
      ((positionX > x && positionX < x + width) ||
        (positionX < x && positionX > x + width)) &&
      ((positionY > y && positionY < y + height) ||
        (positionY < y && positionY > y + height))
    ) {
      return true;
    }
    return false;
  };

  public paint = (canvas2D: CanvasRenderingContext2D, selected: boolean) => {
    const {
      mark: { x, y, width, height }
    } = this.annotationData;
    canvas2D.save();
    if (selected) {
      canvas2D.strokeStyle = "green";
      canvas2D.fillStyle = "green";
      canvas2D.fillRect(x, y, width, height);
    }
    canvas2D.strokeRect(x, y, width, height);
    canvas2D.restore();
  };

  public adjustMark = ({
    width,
    height
  }: {
    width: number;
    height: number;
  }) => {
    this.annotationData.mark.width = width;
    this.annotationData.mark.height = height;
    this.onChangeCallBack();
  };

  public getAnnotationData = () => {
    return this.annotationData;
  };
}
