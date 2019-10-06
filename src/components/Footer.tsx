import React, { Component } from "react";

export class LiberiotFooter extends Component {

    render() {
        return (
            <div data-test="footer" style={{ textAlign: 'center', paddingBottom: '1em', fontFamily: 'Poiret One' }}>
                Liberiot Red - API by  <a href="http://www.liberiot.org"> Liberiot</a>
            </div>
        )
    }
}