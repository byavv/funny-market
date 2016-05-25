import {Component, OnInit, ViewChild, Output, EventEmitter} from "@angular/core";
import {Router, OnActivate} from "@angular/router-deprecated";
import {getDOM, DomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';
import {UsersBackEndApi} from "../../../services/usersBackEndApi";
import {MasterController} from "../../../services/masterController";
import {Car} from "../../../../shared/models";
import {isFunction} from "@angular/compiler/src/facade/lang";

@Component({
    selector: "carImages",
    template: require("./templates/stepImages.html"),
    styles: [require("./styles/stepImages.css")]
})
export class StepImagesComponent implements OnInit {
    @Output()
    next: EventEmitter<any> = new EventEmitter();
    images: Array<any> = [];
    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    processing: boolean = false;
    car: Car;
    submitted: boolean;
    _domAdapter: DomAdapter;

    constructor(
        private master: MasterController,
        private router: Router,
        private backEnd: UsersBackEndApi) { this._domAdapter = getDOM() }

    ngOnInit() {
        console.log("INIT");
        this.master.init$.subscribe(car => {
            this.car = car;
            if (!!car.id) {
                car.images.forEach((image) => {
                    this.images.push(image)
                });
            }
        })
        this.master.validation['img'] = this.images.length > 0;
    }

    ngAfterViewInit() {
        this._domAdapter.createElement("canvas");
        this.canvas = <HTMLCanvasElement>this._domAdapter.createElement("canvas");
        this.canvas.width = 640;
        this.canvas.height = 480;
        if (isFunction(this.canvas.getContext)) {
            this.context = this.canvas.getContext("2d");
        }
        this.context.fillStyle = "#fff";
    }

    delete(image) {
        var index = this.images.indexOf(image);
        if (!!this.car.id && image.key) {
            this.backEnd.deleteImage(this.car.id, image.key).subscribe((res) => {
                console.log(res);
                this.images.splice(index, 1);
            }, err => {
                console.error(err)
            });
        } else {
            this.images.splice(index, 1);
        }
        this._applyImages();
    }

    onFilesSelected(files: FileList) {
        var count = files.length;
        var totalCount = this.images.length;
        var newImages = [];
        if (totalCount + count <= 20 && count > 0) {
            this.processing = true;
            Object.keys(files).forEach((key) => {
                if (/\.(jpe?g|png)$/i.test(files[key].name)) {
                    let reader = new FileReader();
                    reader.addEventListener("load", (evt) => {
                        newImages.push({ data: reader.result, name: files[key].name });
                        count--;
                        if (count == 0) {
                            this.images.push(...this.process(newImages));
                            this._applyImages();
                            setTimeout(() => {
                                this.processing = false;
                            }, 500);
                        }
                    });
                    reader.readAsDataURL(files[key]);
                }
            })
        } else {
            console.warn("Not more then 20 images");
        }
    }

    process(images: Array<any>) {
        return images.map(image => {
            var img = new Image();
            img.src = image.data;
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = "#fff";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.drawImage(img, 0, 0, img.width, img.height,
                0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = "grey";
            this.context.fillText("WATERMARK", this.canvas.width - 100, this.canvas.height - 20);
            this.context.fillStyle = "#fff";
            image.data = this.canvas.toDataURL("image/jpeg", 0.92);
            return image;
        })
    }

    onSelectImage(image) {
        console.warn("Should open modal window, not implemented yet");
    }

    onNext() {
        if (this.master.validation['img']) {
            this.next.next("opt");
        }
    }

    private _applyImages() {
        var newImages = [];
        this.images.forEach((image) => {
            if (image.data) {
                newImages.push({
                    blob: this._b64toBlob(image.data),
                    name: image.name
                })
            }
        })
        this.master.validation['img'] = newImages.length > 0;
        this.master.images = newImages;
    }

    private _b64toBlob(b64Data, contentType?, sliceSize?): Blob {
        contentType = contentType || "image/jpeg";
        sliceSize = sliceSize || 256;
        b64Data = b64Data.replace(/^data:image\/\w+;base64,/, "");
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: contentType });
    }
}