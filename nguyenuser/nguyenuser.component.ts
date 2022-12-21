import {Component, OnInit, ViewChild} from '@angular/core';
import {ColumnMode, DatatableComponent} from "@swimlane/ngx-datatable";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {CoreSidebarService} from "../../../../@core/components/core-sidebar/core-sidebar.service";
import {CoreConfigService} from "../../../../@core/services/config.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {takeUntil} from "rxjs/operators";
import {NguyenuserService} from "../../../services/nguyenuser.service";
import {CrudNguyenuserComponent} from "../nguyenuser/crud-nguyenuser/crud-nguyenuser.component";

@Component({
  selector: 'app-nguyenuser',
  templateUrl: './nguyenuser.component.html',
  styleUrls: ['./nguyenuser.component.scss']
})
export class NguyenuserComponent implements OnInit {
  // Các trường data
  id: string;
  name: string;
  config: string;
  isActive: number;
  // Các trường tìm kiếm
  keyword: string;
  searchConfig: string;
  // Public
  sidebarToggleRef = false;
  listDataTable = [];
  selectedOption = 10;
  ColumnMode = ColumnMode;
  temp = [];
  previousRoleFilter = '';
  previousPlanFilter = '';
  previousStatusFilter = '';
  totalRecords = 0;
  // Phân trang
  _pageIndex = 1;
  _pageSize = 10;

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  constructor(
    private readonly router: Router,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private nguyenuserService: NguyenuserService,
    private modalService: NgbModal,
    private toastService: ToastrService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      if (config.layout.animation === 'zoomIn') {
      } else {
      }
    });
    this.search();
  }
  search() {
    const queryParams = {
      keyword: this.keyword,
      pageIndex: this._pageIndex - 1,
      pageSize: this._pageSize
    };
    this.nguyenuserService.searchNguyen(queryParams).subscribe((res: any) => {
      if (res && res.data) {
        this.totalRecords = res.data.totalCount;
        this.listDataTable = res.data.items;
      }
    }, (error: any) => {
      this.toastService.error('Không tìm thấy bản ghi',
        'Thất bại', {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        })
    });
  }
  pageChange(page) {
    this.search()
  }
  delete() {
    this.nguyenuserService.deleteNguyen(this.id).subscribe((res: any) => {
      if (res) {
        this.search();
        this.toastService.success(
          'Xóa thành công',
          'Thành công', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          }
        );
        this.id = null;
      }
    })
  }
  /**
   * modalOpenForm: mở dialog để thực hiện view/thêm mới/sửa
   * @param modalForm
   * @param id
   * @param isView
   * @param isEdit
   */
  // Mở modal edit - create
  modalOpenForm(id: any) {
    const modalRef = this.modalService.open(CrudNguyenuserComponent, {
      centered: true,
    });
    // quizId - tên biến trùng với input màn hình cần mở dialog
    modalRef.componentInstance.userid = id;
    // lắng nghe event khi dialog close
    modalRef.result.then((data) => {
      if (data) {
        this.search();
      }
    }, (reason) => {
      // on dismiss
    });
  }
  modalConfirm(modalPrimary, id) {
    this.id = id;
    this.modalService.open(modalPrimary, {
      centered: true,
      windowClass: 'modal modal-warning'
    });
  }
  getIndexTable(index: number) {
    const firstindex = index + 1;// ((this._pageIndex - 1) * this._pageSize + 1) + index;
    return this.totalRecords ? firstindex : 0;
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}