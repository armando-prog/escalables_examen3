import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

export interface Nota {
  _id: string;
  titulo: string;
  contenido: string;
}

export interface NuevaNota {
  titulo: string;
  contenido: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/notas';

  readonly notas: WritableSignal<Nota[]> = signal([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  cargarNotas(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.http.get<Nota[]>(this.apiUrl)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (notas) => this.notas.set(notas),
        error: (error: unknown) => this.error.set(this.mensajeDeError(error))
      });
  }

  agregarNota(nuevaNota: NuevaNota): Observable<Nota> {
    this.error.set(null);

    return this.http.post<Nota>(this.apiUrl, nuevaNota).pipe(
      tap((nota) => this.notas.update((notas) => [nota, ...notas])),
      catchError((error: unknown) => {
        this.error.set(this.mensajeDeError(error));
        return throwError(() => error);
      })
    );
  }

  actualizarNota(id: string, cambios: NuevaNota): Observable<Nota> {
    this.error.set(null);

    return this.http.patch<Nota>(`${this.apiUrl}/${id}`, cambios).pipe(
      tap((notaActualizada) =>
        this.notas.update((notas) =>
          notas.map((nota) => nota._id === notaActualizada._id ? notaActualizada : nota)
        )
      ),
      catchError((error: unknown) => {
        this.error.set(this.mensajeDeError(error));
        return throwError(() => error);
      })
    );
  }

  private mensajeDeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const response = error.error;

      if (
        typeof response === 'object' &&
        response !== null &&
        'msg' in response &&
        typeof response.msg === 'string'
      ) {
        return response.msg;
      }
    }

    if (error instanceof HttpErrorResponse && error.status === 0) {
      return 'No se pudo conectar con el servidor. Revisa que el backend esté iniciado.';
    }

    return 'Ocurrió un error al comunicarse con el servidor. Inténtalo de nuevo.';
  }
}
