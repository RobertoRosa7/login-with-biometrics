import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public hasBiomtrics!: boolean;

  constructor(
    private title: Title
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Login com biometria | Angular');
  }

  public onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    console.log(event);
  }

  public onSend(event: boolean): void {
    this.hasBiomtrics = event;
  }

}
