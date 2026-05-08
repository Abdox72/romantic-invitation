import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hearts-canvas',
  standalone: true,
  template: `<canvas #canvas class="hearts"></canvas>`,
  styles: [`.hearts{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}`]
})
export class HeartsCanvasComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() opacity = 0.35;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const hearts = Array.from({ length: 32 }, () => ({ x: Math.random(), y: Math.random(), s: 1 + Math.random() * 8 }));
    const draw = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = `rgba(201,168,76,${this.opacity})`;
      hearts.forEach((h) => {
        h.y -= 0.002;
        if (h.y < 0) h.y = 1;
        ctx.fillText('♥', h.x * canvas.width, h.y * canvas.height);
      });
      requestAnimationFrame(draw);
    };
    draw();
  }
}
