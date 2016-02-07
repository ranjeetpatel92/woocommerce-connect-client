var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var Settings = require( './views/settings' );

document.addEventListener( "DOMContentLoaded", function( event ) {
    ReactDOM.render(
        React.createElement( Settings, { schema: window.wcConnectData.usps } ), document.getElementById( 'wc-connect-admin-container' )
    );
} );