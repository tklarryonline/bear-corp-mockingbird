requirejs.config({
    paths: {
        'angular': '/static/js/angular/angular',
        'angular-ui-router': '/static/js/angular-ui-router/release/angular-ui-router',
        /*require ui-bootstrap with the embeded template [http://angular-ui.github.io/bootstrap/]*/
        'ui-bootstrap-tpls': '/static/js/angular-bootstrap/ui-bootstrap-tpls',
        /*require jquery*/
        'jquery': '/static/js/jquery/dist/jquery',
        /*require lodash library [http://lodash.com/docs]*/
        'lodash': '/static/js/lodash/dist/lodash',
        /*require bootstrap.js to make bootstrap components work*/
        'bootstrap': '/static/js/sass-bootstrap/dist/js/bootstrap',
        'FileAPI': '/static/js/FileAPI/dist/FileAPI',
        'angular-file-upload-shim': '/static/js/ng-file-upload/angular-file-upload-shim',
        'angular-file-upload': '/static/js/ng-file-upload/angular-file-upload',
        'recorder': '/static/js/Recorderjs/recorder',
        'FileSaver': '/static/js/FileSaver/FileSaver',
        /*--insert code tag--do not remove*/
        'upload': '/static/js/upload/jquery.fileupload',
        'iframe-transport': '/static/js/upload/jquery.iframe-transport',
        'jquery.ui.widget': '/static/js/upload/jquery.ui.widget'
    },
    shim: {
        'angular': { exports: 'angular', deps: ['jquery', 'angular-file-upload-shim'] },
        'lodash': { exports: '_' },
        'angular-ui-router': ['angular'],
        'ui-bootstrap-tpls': ['angular'],
        'bootstrap': ['jquery'],
        'angular-file-upload-shim': ['FileAPI'],
        'angular-file-upload': ['angular'],
        'iframe-transport': ['jquery'],
        'upload': ['iframe-transport', 'jquery.ui.widget']
    }/*--requirejs config copy tag--do not remove*/
});
