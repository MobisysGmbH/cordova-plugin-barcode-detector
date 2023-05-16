'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var barcodeFormat = Object.freeze({
    Code128: 1,
    Code39: 2,
    Code93: 4,
    CodaBar: 8,
    DataMatrix: 16,
    EAN13: 32,
    EAN8: 64,
    ITF: 128,
    QRCode: 256,
    UPCA: 512,
    UPCE: 1024,
    PDF417: 2048,
    Aztec: 4096,
});
var barcodeType = Object.freeze({
    CONTACT_INFO: 1,
    EMAIL: 2,
    ISBN: 3,
    PHONE: 4,
    PRODUCT: 5,
    SMS: 6,
    TEXT: 7,
    URL: 8,
    WIFI: 9,
    GEO: 10,
    CALENDAR_EVENT: 11,
    DRIVER_LICENSE: 12,
});

var defaultOptions = Object.freeze({
    barcodeFormats: {
        Code128: true,
        Code39: true,
        Code93: true,
        CodaBar: true,
        DataMatrix: true,
        EAN13: true,
        EAN8: true,
        ITF: true,
        QRCode: true,
        UPCA: true,
        UPCE: true,
        PDF417: true,
        Aztec: true,
    },
    beepOnSuccess: false,
    vibrateOnSuccess: false,
    detectorSize: 0.6,
    rotateCamera: false,
});

function keyByValue(obj, value) {
    var keys = Object.keys(obj);
    var index = keys.map(function (key) { return obj[key]; }).indexOf(value);
    return keys[index] || String(value);
}

var MLKitBarcodeScanner = /** @class */ (function () {
    function MLKitBarcodeScanner() {
    }
    MLKitBarcodeScanner.prototype.getBarcodeFormat = function (format) {
        return keyByValue(barcodeFormat, format);
    };
    MLKitBarcodeScanner.prototype.getBarcodeType = function (type) {
        return keyByValue(barcodeType, type);
    };
    MLKitBarcodeScanner.prototype.getBarcodeFormatFlags = function (barcodeFormats) {
        var barcodeFormatFlag = 0;
        var key;
        var formats = barcodeFormats || defaultOptions.barcodeFormats;
        // eslint-disable-next-line no-restricted-syntax
        for (key in formats) {
            if (barcodeFormat.hasOwnProperty(key) &&
                formats.hasOwnProperty(key) &&
                formats[key]) {
                barcodeFormatFlag += barcodeFormat[key];
            }
        }
        return barcodeFormatFlag;
    };
    MLKitBarcodeScanner.prototype.scan = function (userOptions, success, failure) {
        var barcodeFormats = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.barcodeFormats) || defaultOptions.barcodeFormats;
        var config = __assign(__assign(__assign({}, defaultOptions), userOptions), { barcodeFormats: this.getBarcodeFormatFlags(barcodeFormats) });
        this.sendScanRequest(config, success, failure);
    };
    MLKitBarcodeScanner.prototype.sendScanRequest = function (config, successCallback, failureCallback) {
        var _this = this;
        cordova.exec(function (data) {
            var text = data[0], format = data[1], type = data[2];
            successCallback({
                text: text,
                format: _this.getBarcodeFormat(format),
                type: _this.getBarcodeType(type),
            });
        }, function (err) {
            switch (err[0]) {
                case null:
                case 'USER_CANCELLED':
                    failureCallback({
                        cancelled: true,
                        message: 'The scan was cancelled.',
                    });
                    break;
                case 'SCANNER_OPEN':
                    failureCallback({
                        cancelled: false,
                        message: 'Scanner already open.',
                    });
                    break;
                default:
                    failureCallback({
                        cancelled: false,
                        message: err[0] || 'Unknown Error',
                    });
                    break;
            }
        }, 'cordova-plugin-mlkit-barcode-scanner', 'startScan', [config]);
    };
    return MLKitBarcodeScanner;
}());
var barcodeScanner = new MLKitBarcodeScanner();
module.exports = barcodeScanner;

exports.MLKitBarcodeScanner = MLKitBarcodeScanner;
