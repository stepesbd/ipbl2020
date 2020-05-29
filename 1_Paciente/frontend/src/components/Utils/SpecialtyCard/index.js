import React, { Fragment } from 'react';
import { Card, CardBody } from 'shards-react';

function SpecialtyCard(props) {
    return (
        <Fragment>
            <Card>
                <CardBody>
                    {props.specialty.name}
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default SpecialtyCard;