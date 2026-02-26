import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BrAnimationService } from '../../animations/animation.service';


export interface BrUploadFile {
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
}

@Component({
  selector: 'br-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    @keyframes br-upload-file-enter {
      from { opacity: 0; transform: translateY(-8px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrUploadComponent),
      multi: true,
    },
  ],
  /*
   * A área de soltar arquivos NÃO leva `aria-label`: ela já tem texto visível
   * dentro, e um rótulo diferente do texto quebra
   * `label-content-name-mismatch` — quem navega por voz fala o que lê.
   */
  template: `
    <!-- Drop zone -->
    <div class="font-rawline">
      @if (label) {
        <span class="block text-govbr-sm font-semibold text-govbr-gray-80 mb-1">
          {{ label }}
          @if (required) {
            <span class="text-govbr-danger-dark" aria-hidden="true">*</span>
          }
        </span>
      }

      <div
        [class]="dropzoneClasses"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
        (keydown.enter)="fileInput.click()"
        (keydown.space)="fileInput.click()"
        role="button"
        tabindex="0"
        [attr.aria-describedby]="descricaoAcessivel"

        >
        <i class="fa-solid fa-cloud-arrow-up text-2xl mb-2"
          [class.text-govbr-primary]="!dragging"
          [class.text-govbr-on-primary]="dragging"
        ></i>
        <p class="text-govbr-sm font-semibold"
          [class.text-govbr-gray-80]="!dragging"
          [class.text-govbr-on-primary]="dragging"
        >
          Arraste arquivos aqui ou clique para selecionar
        </p>
        <p [class]="'text-govbr-xs mt-1 ' + (dragging ? 'text-govbr-on-primary opacity-80' : 'text-govbr-gray-60')">
          @if (accept) {
            Formatos: {{ accept }}
          }
          @if (maxSizeMB) {
            &middot; Max: {{ maxSizeMB }}MB
          }
        </p>
      </div>

      <input
        #fileInput
        type="file"
        [attr.aria-describedby]="descricaoAcessivel"
        [attr.aria-invalid]="error ? 'true' : null"
        class="hidden"
        [accept]="accept"
        [multiple]="multiple"
        (change)="onFileSelect($event)"
      />

      @if (helperText && !error) {
        <p [id]="uploadId + '-hint'" class="text-govbr-xs text-govbr-gray-60 mt-1">{{ helperText }}</p>
      }
      @if (error) {
        <p [id]="uploadId + '-error'" class="text-govbr-xs text-govbr-danger-dark mt-1" role="alert">{{ error }}</p>
      }

      <!-- File list -->
      @if (files.length > 0) {
        <ul class="mt-3 space-y-2" role="list">
          @for (f of files; track f.name; let i = $index) {
            <li class="flex items-center gap-3 p-3 bg-govbr-gray-2 rounded-md border border-govbr-gray-10" [style.animation]="fileItemAnimation">
              <!-- Preview -->
              @if (f.preview) {
                <img
                  [src]="f.preview"
                  [alt]="f.name"
                  class="w-10 h-10 rounded object-cover flex-shrink-0"
                />
              } @else {
                <div class="w-10 h-10 rounded bg-govbr-gray-10 flex items-center justify-center flex-shrink-0">
                  <i [class]="getFileIcon(f.type) + ' text-govbr-gray-60'"></i>
                </div>
              }

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="text-govbr-sm text-govbr-gray-80 font-medium truncate">{{ f.name }}</p>
                <p class="text-govbr-xs text-govbr-gray-60">{{ formatSize(f.size) }}</p>
                @if (f.status === 'uploading') {
                  <div class="mt-1 h-1.5 bg-govbr-gray-10 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-govbr-primary rounded-full transition-all duration-300"
                      [style.width.%]="f.progress"
                    ></div>
                  </div>
                }
                @if (f.status === 'error') {
                  <p class="text-govbr-xs text-govbr-danger-dark mt-0.5">Erro no envio</p>
                }
              </div>

              <!-- Status / Remove -->
              @if (f.status === 'done') {
                <i class="fa-solid fa-check-circle text-govbr-success-dark flex-shrink-0"></i>
              }
              @if (!disabled) {
                <button
                  type="button"
                  class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-govbr-gray-60 hover:text-govbr-danger-dark hover:bg-govbr-gray-5 transition-colors govbr-focus-ring"
                  aria-label="Remover arquivo"
                  (click)="removeFile(i, $event)"
                  >
                  <i class="fa-solid fa-xmark text-sm"></i>
                </button>
              }
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class BrUploadComponent implements ControlValueAccessor {
  private readonly animationService = inject(BrAnimationService);

  private static nextId = 0;
  readonly uploadId = `br-upload-${BrUploadComponent.nextId++}`;

  /** Ids que descrevem o campo — o apoio não era anunciado, só pintado. */
  get descricaoAcessivel(): string | null {
    if (this.error) return `${this.uploadId}-error`;
    if (this.helperText) return `${this.uploadId}-hint`;
    return null;
  }

  @Input() label?: string;
  @Input() accept = '';
  @Input() multiple = false;
  @Input() maxSizeMB?: number;
  @Input() maxFiles?: number;
  @Input() required = false;
  @Input() helperText?: string;
  @Input() error?: string;
  @Input() disabled = false;

  @Output() filesChange = new EventEmitter<BrUploadFile[]>();
  @Output() fileAdded = new EventEmitter<BrUploadFile>();
  @Output() fileRemoved = new EventEmitter<BrUploadFile>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  files: BrUploadFile[] = [];
  dragging = false;

  get fileItemAnimation(): string {
    if (!this.animationService.isEnabled()) return 'none';
    return 'br-upload-file-enter 250ms ease-out forwards';
  }

  private onChange: (value: File[]) => void = () => {};
  private onTouched: () => void = () => {};

  get dropzoneClasses(): string {
    const base = [
      'border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors',
      'govbr-focus-ring',
    ].join(' ');

    if (this.disabled) {
      return `${base} border-govbr-gray-10 bg-govbr-gray-2 cursor-not-allowed opacity-60`;
    }
    if (this.dragging) {
      return `${base} border-govbr-primary bg-govbr-primary`;
    }
    if (this.error) {
      return `${base} border-govbr-danger bg-govbr-bg hover:bg-govbr-danger-bg`;
    }
    return `${base} border-govbr-gray-20 bg-govbr-bg hover:bg-govbr-gray-2 hover:border-govbr-primary`;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) this.dragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragging = false;
    if (this.disabled || !event.dataTransfer?.files.length) return;
    this.addFiles(Array.from(event.dataTransfer.files));
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.addFiles(Array.from(input.files));
    }
    input.value = '';
  }

  removeFile(index: number, event: Event): void {
    event.stopPropagation();
    const removed = this.files.splice(index, 1)[0];
    this.fileRemoved.emit(removed);
    this.emitChange();
  }

  private addFiles(fileList: File[]): void {
    for (const file of fileList) {
      if (this.maxSizeMB && file.size > this.maxSizeMB * 1024 * 1024) continue;
      if (this.maxFiles && this.files.length >= this.maxFiles) break;
      if (!this.multiple && this.files.length >= 1) {
        this.files = [];
      }

      const entry: BrUploadFile = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 100,
        status: 'done',
      };

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          entry.preview = reader.result as string;
        };
        reader.readAsDataURL(file);
      }

      this.files.push(entry);
      this.fileAdded.emit(entry);
    }
    this.emitChange();
    this.onTouched();
  }

  private emitChange(): void {
    const raw = this.files.map(f => f.file);
    this.onChange(raw);
    this.filesChange.emit([...this.files]);
  }

  getFileIcon(type: string): string {
    if (type.startsWith('image/')) return 'fa-solid fa-image';
    if (type.includes('pdf')) return 'fa-solid fa-file-pdf';
    if (type.includes('word') || type.includes('document')) return 'fa-solid fa-file-word';
    if (type.includes('sheet') || type.includes('excel')) return 'fa-solid fa-file-excel';
    return 'fa-solid fa-file';
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // ControlValueAccessor
  writeValue(value: File[] | null): void {
    if (!value) {
      this.files = [];
    }
  }

  registerOnChange(fn: (value: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
