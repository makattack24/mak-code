import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsgameComponent } from './graphicsgame.component';

describe('GraphicsgameComponent', () => {
  let component: GraphicsgameComponent;
  let fixture: ComponentFixture<GraphicsgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicsgameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicsgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
