import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NguyenuserService} from "../../../../services/nguyenuser.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {getResponseErrorMessage} from "../../../../common/common-function";

@Component({
  selector: 'app-crud-nguyenuser',
  templateUrl: './crud-nguyenuser.component.html',
  styleUrls: ['./crud-nguyenuser.component.scss']
})
export class CrudNguyenuserComponent implements OnInit {

  @Input() public userid;
  loading = false;
 

  detailForm: FormGroup
  constructor(
    private nguyenuserService: NguyenuserService,
    private modalService: NgbModal,
    private ngbModalRef: NgbActiveModal,
    private fb: FormBuilder,
    private toastService: ToastrService,

  ) {
    this.detailForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      description: this.fb.control('', [Validators.required])
      // isActive: this.fb.control(null, [Validators.required])
      // jira: this.fb.control('', [Validators.required]),
      // telegram: this.fb.control('', [Validators.required])
      // status: this.fb.control('', [Validators.required]),
     
    })
  }
  get name() {
    return this.detailForm.get('name');
  }
  get description() {
    return this.detailForm.get('description');
  }
  // get jira() {
  //   return this.detailForm.get('jira');
  // }
  // get telegram() {
  //   return this.detailForm.get('telegram');
  // }
  //  get status() {
  //   return this.detailForm.get('status');
  // }


  ngOnInit(): void {
    if (this.userid) {
      this.mappingCurrentValue();
    }
  }
  mappingCurrentValue() {
    this.nguyenuserService.getNguyenById(this.userid).subscribe((res: any) => {
      if (res && res.data) {
        var data = res.data;
        this.detailForm.patchValue({
          name: data.name,
          description: data.description
        })
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  addOrEdit() {
    this.detailForm.markAllAsTouched();
    if (this.detailForm.invalid) {
      return;
    }
    const body = {
      id: this.userid,
      name: this.name.value,
      description: this.description.value,
      // jira: this.jira.value,
      // telegram: this.telegram.value,
      // status: this.status.value,
      // isActive: this.isActive.value
    };
    this.loading = true;
    this.nguyenuserService.addOrEditNguyen(body).subscribe((res: any) => {
      this.loading = false;
      if (res) {
        this.ngbModalRef.close(true);
        this.toastService.success(
          'Lưu thành công',
          'Thành công', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          }
        );
      }
    }, (error: any) => {
      this.loading = false;
      this.toastService.error(
        getResponseErrorMessage(error), 'Thông báo lỗi', {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        }
      );
    });
  }
  closeDialog(){
    this.ngbModalRef.close();
  }


}
