import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Medication, Review } from '../types';

@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  readonly #http = inject(HttpClient);
  med_list = signal<Medication[]>([]);

  

//   // GET /medications?first_letter=A
// response_body = { "success": boolean, "data": Medication[] } // only name

  getMedication$(chr = 'A') {
    return this.#http.get<{ success: boolean, data: Medication[] }>(
      environment.BACKEND_SERVER_URL + `/medications?first_letter=${chr}`
    );
  }

  getMedicationById(medication_id:string){
    return this.#http.get<{ success: boolean, data: Medication}>(environment.BACKEND_SERVER_URL + '/medications/' + medication_id)
  }
  deleteMedicationById(medication_id:string){
    return this.#http.delete<{ success: boolean, data: boolean}>(environment.BACKEND_SERVER_URL + '/medications/' + medication_id)
  }
  addMedication(medication:FormData){
    return this.#http.post<{ success: boolean, data: Medication}>(environment.BACKEND_SERVER_URL + '/medications', medication)
  }
  updateMedication(medication_id:string, medication:FormData){
    return this.#http.put<{ success: boolean, data: Medication}>(environment.BACKEND_SERVER_URL + '/medications/' + medication_id, medication)
  }
  // // POST /medications/:medication_id/reviews

  addReview(medication_id: string, review:{review:string, rating:string}){
    return this.#http.post<{ success: boolean, data: string}>(environment.BACKEND_SERVER_URL + "/medications/" + medication_id + "/reviews", review)
  }

  // // GET /medications/:medication_id/reviews

  getReviews(medication_id:string, ){
    return this.#http.get<{ success: boolean, data: Review[]}>(environment.BACKEND_SERVER_URL + '/medications/' + medication_id + "/reviews")
  }

  // // GET /medications/:medication_id/reviews/:review_id
  getReviewById(medication_id:string, review_id:string){
    return this.#http.get<{ success: boolean, data: Review}>(environment.BACKEND_SERVER_URL + '/medications/' + medication_id + "/reviews/" + review_id)
  }

 // // PUT /medications/:medication_id/reviews/:review_id
  updateReview(medication_id:string, review: Review){
    return this.#http.put<{ success: boolean, data: boolean}>(environment.BACKEND_SERVER_URL + "/medications/" + medication_id + "/reviews/" + review._id, review )
  }

 // // DELETE /medications/:medication_id/reviews/:review_id

 deleteReviews(medication_id:string, review_id:string){
  return this.#http.delete<{ success: boolean, data: boolean}>(environment.BACKEND_SERVER_URL + '/medications/' + medication_id + "/reviews/" + review_id)
}

//Check if the medication name exist
validateName(name:string){
  return this.#http.post<{success:boolean, data:string | null}>(environment.BACKEND_SERVER_URL + '/medications/check', {name})
}
 
}
