import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrToastService } from './br-toast.service';

describe('BrToastService', () => {
  let service: BrToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success()', () => {
    it('should add a success toast', () => {
      service.success('Operação realizada com sucesso');
      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].type).toBe('success');
      expect(service.toasts()[0].message).toBe('Operação realizada com sucesso');
    });

    it('should support title option', () => {
      service.success('Dados salvos', { title: 'Sucesso!' });
      expect(service.toasts()[0].title).toBe('Sucesso!');
    });
  });

  describe('danger()', () => {
    it('should add a danger toast', () => {
      service.danger('Erro ao salvar');
      expect(service.toasts()[0].type).toBe('danger');
    });
  });

  describe('warning()', () => {
    it('should add a warning toast', () => {
      service.warning('Atenção!');
      expect(service.toasts()[0].type).toBe('warning');
    });
  });

  describe('info()', () => {
    it('should add an info toast', () => {
      service.info('Informação importante');
      expect(service.toasts()[0].type).toBe('info');
    });
  });

  describe('dismiss()', () => {
    it('should remove a specific toast', () => {
      const id = service.success('Test');
      expect(service.toasts().length).toBe(1);
      service.dismiss(id);
      expect(service.toasts().length).toBe(0);
    });
  });

  describe('dismissAll()', () => {
    it('should remove all toasts', () => {
      service.success('Toast 1');
      service.danger('Toast 2');
      service.warning('Toast 3');
      expect(service.toasts().length).toBe(3);
      service.dismissAll();
      expect(service.toasts().length).toBe(0);
    });
  });

  describe('auto-dismiss', () => {
    it('should auto-dismiss after duration', fakeAsync(() => {
      service.success('Test', { duration: 1000 });
      expect(service.toasts().length).toBe(1);
      tick(1000);
      expect(service.toasts().length).toBe(0);
    }));

    it('should not auto-dismiss when duration is 0', fakeAsync(() => {
      service.success('Persistent', { duration: 0 });
      expect(service.toasts().length).toBe(1);
      tick(10000);
      expect(service.toasts().length).toBe(1);
    }));
  });

  describe('options', () => {
    it('should set dismissible to true by default', () => {
      service.success('Test');
      expect(service.toasts()[0].dismissible).toBe(true);
    });

    it('should allow disabling dismissible', () => {
      service.success('Test', { dismissible: false });
      expect(service.toasts()[0].dismissible).toBe(false);
    });

    it('should use custom duration', () => {
      service.success('Test', { duration: 10000 });
      expect(service.toasts()[0].duration).toBe(10000);
    });
  });
});
