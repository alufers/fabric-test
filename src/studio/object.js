import { fabric } from "fabric";

(function () {
  fabric.CustomObject = fabric.util.createClass(fabric.Rect, {
    initialize(options) {
      options = {
        ...options,
        width: 200,
        height: 200,
        padding: 10,
        margin: 10,
        cornerStyle: "circle",
        cornerPadding: 10,
        borderColor: "black",
        cornerColor: "black",

        fill: "yellow",
        hasRotatingPoint: false,
      };

      this.setControlsVisibility({
        tl: true,
        tr: true,
        bl: true,
        br: true,

        // disable middle controls
        ml: false,
        mt: false,
        mr: false,
        mb: false,
        mtr: false,
      });

      // monkey patch a fabric canvas method
      fabric.Canvas.prototype._getActionFromCorner = function (
        alreadySelected,
        corner
      ) {
        if (!corner || !alreadySelected) {
          return "drag";
        }

        switch (corner) {
          case "tl":
          case "br":
            return "rotate";
          default:
            return "scale";
        }
      };

      this.callSuper("initialize", options);
    },
    /**
     * Calculates the corner coords, including cornerPadding.
     * Overrides a fabric.js method and is based on it.
     */
    _setCornerCoords() {
      let coords = this.oCoords,
        newTheta = fabric.util.degreesToRadians(45 - this.angle),
        /* 0.707106 stands for sqrt(2)/2 */
        cornerHypotenuse = this.cornerSize * 0.707106,
        cosHalfOffset =
          cornerHypotenuse * fabric.util.cos(newTheta) + this.cornerPadding,
        sinHalfOffset =
          cornerHypotenuse * fabric.util.sin(newTheta) + this.cornerPadding,
        x,
        y;

      for (let point in coords) {
        x = coords[point].x;
        y = coords[point].y;
        coords[point].corner = {
          tl: {
            x: x - sinHalfOffset,
            y: y - cosHalfOffset,
          },
          tr: {
            x: x + cosHalfOffset,
            y: y - sinHalfOffset,
          },
          bl: {
            x: x - cosHalfOffset,
            y: y + sinHalfOffset,
          },
          br: {
            x: x + sinHalfOffset,
            y: y + cosHalfOffset,
          },
        };
      }
    },
    /**
     * Draws corner controls of the box
     * @param {*} control 
     * @param {*} ctx 
     * @param {*} methodName 
     * @param {*} left 
     * @param {*} top 
     * @returns 
     */
    _drawControl(control, ctx, methodName, left, top) {
      // omit hidden controls
      if (!this.isControlVisible(control)) return;

      const size = this.cornerSize;
      const l = left + size / 2;
      const t = top + size / 2;

      switch (control) {
        // rotate circles
        case "br":
          this.drawCircle(ctx, l + this.cornerPadding, t + this.cornerPadding);
          break;
        case "tl":
          this.drawCircle(ctx, l - this.cornerPadding, t - this.cornerPadding);
          break;
        // resize triangles
        case "bl":
          this.drawTriangle(ctx, l - size, t + size, Math.PI + Math.PI / 4);
          break;
        case "tr":
          this.drawTriangle(ctx, l - size + 25, t + size - 25, Math.PI / 4);
          break;
        default:
          throw new Error(`Unknown control: ${control}`);
      }
    },
    /**
     * Draws a triangle control for resizing the box.
     * @param {*} ctx
     * @param {*} left
     * @param {*} top
     * @param {*} rotation
     */
    drawTriangle(ctx, left, top, rotation = 0) {
      const triangleSize = 20;
      ctx.translate(left, top);
      ctx.rotate(rotation);
      ctx.translate(0, -10);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-triangleSize / 2.5, (Math.sqrt(3) * triangleSize) / 2);
      ctx.lineTo(triangleSize / 2.5, (Math.sqrt(3) * triangleSize) / 2);
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.translate(0, 10);
      ctx.rotate(-rotation);
      ctx.translate(-left, -top);
    },
    /**
     * Draws a circle for rotating the box
     * @param {*} ctx
     * @param {*} left
     * @param {*} top
     */
    drawCircle(ctx, left, top) {
      ctx.translate(left, top);
      ctx.beginPath();
      ctx.arc(0, 0, this.cornerSize / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.translate(-left, -top);
    },
  });
})();

const createFabricObject = (extraOpts) => {
  return new fabric.CustomObject(extraOpts);
};

export default createFabricObject;
