import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  private validEmail = 'sarit61933@gmail.com';
  private validPassword = '123456';

  constructor(private fb: FormBuilder, private http: HttpClient, private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    debugger
    return this.loginForm.get('password')!;
  }
 onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // בדיקה לוקאלית: האם האימייל והסיסמה נכונים
      if (email === this.validEmail && password === this.validPassword) {
        localStorage.setItem('token', 'dummy-token'); // שמירת טוקן פיקטיבי
        this.router.navigate(['/calendar']); // מעבר ללוח שנה
      } else {
        alert('אימייל או סיסמה לא חוקיים'); // הודעת שגיאה
      }
    }
  }
}


