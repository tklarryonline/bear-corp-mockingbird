requirejs.config({
    baseUrl: './src',
    paths: {
        'angular': '../bower_components/angular/angular',
        /*require angular mocks for testing*/
        'angular-mocks': '../bower_components/angular-mocks/angular-mocks',
        /*require angular resource for easily handling sending and receiving request*/
        'angular-resource': '../bower_components/angular-resource/angular-resource',
        /*require angular for better handling and binding controller*/
        'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',
        /*require ui-bootstrap with the embeded template [http://angular-ui.github.io/bootstrap/]*/
        'ui-bootstrap-tpls': '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
        /*require jquery*/
        'jquery': '../bower_components/jquery/dist/jquery',
        /*require lodash library [http://lodash.com/docs]*/
        'lodash': '../bower_components/lodash/dist/lodash',
        /*require bootstrap.js to make bootstrap components work*/
        'bootstrap': '../bower_components/sass-bootstrap/dist/js/bootstrap',
        'FileAPI': '../bower_components/FileAPI/dist/FileAPI',
        'angular-file-upload-shim': '../bower_components/ng-file-upload/angular-file-upload-shim',
        'angular-file-upload': '../bower_components/ng-file-upload/angular-file-upload'
        /*--insert code tag--do not remove*/
    },
    shim: {
        'angular': { exports: 'angular', deps: ['jquery', 'angular-file-upload-shim'] },
        'angular-mocks': ['angular'],
        'lodash': { exports: '_' },
        'angular-resource': ['angular'],
        'angular-ui-router': ['angular'],
        'ui-bootstrap-tpls': ['angular'],
        'bootstrap': ['jquery'],
        'angular-file-upload-shim': ['FileAPI'],
        'angular-file-upload': ['angular']
    }/*--requirejs config copy tag--do not remove*/
});
