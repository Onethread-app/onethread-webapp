import React from 'react';
import { Card, Elevation, TextArea } from '@blueprintjs/core';

export const Activity = () => {
    return (
        <div className="fl w-100 overflow-y-auto min-h-100 pa2">
            <Card interactive={true} elevation={Elevation.TWO}>
                <div className="">
                    <h1 className="f5 fw6 lh-title black">Activity</h1>
                    <div className="pa2">
                        <article className="dt pb2 mt2 w-100">
                            <div className="dtc w2 v-mid">
                                <img src="http://mrmrs.github.io/photos/p/2.jpg" className="ba b--black-10 db br-100 w2 h2" />
                            </div>
                            <div className="dtc v-mid pl3">
                                <TextArea
                                    className="w-80"
                                    style={{ resize: 'none', boxShadow: 'none', backgroundColor: '#F2FAFA', height: 'auto' }}
                                    growVertically={true}
                                    placeholder="Write a comment..."
                                />
                            </div>
                        </article>
                        <article className="dt pb2 mt2">
                            <div className="dtc w2">
                                <img src="http://mrmrs.github.io/photos/p/2.jpg" className="ba b--black-10 db br-100 w2 h2" />
                            </div>
                            <div className="dtc v-mid pl3">
                                <h1 className="f6 fw6 lh-title black mv0">Md Saiful Islam </h1>
                                <p
                                    className="pa2 br3 mt2"
                                    style={{
                                        backgroundColor: '#F2FAFA'
                                    }}
                                >
                                    It is a long established fact that a reader will be distracted by the readable
                  </p>
                            </div>
                        </article>
                        <article className="dt pb2 mt2">
                            <div className="dtc w2">
                                <img src="http://mrmrs.github.io/photos/p/2.jpg" className="ba b--black-10 db br-100 w2 h2" />
                            </div>
                            <div className="dtc v-mid pl3">
                                <h1 className="f6 fw6 lh-title black mv0">Md Saiful Islam </h1>
                                <p
                                    className="pa2 br3 mt2"
                                    style={{
                                        backgroundColor: '#F2FAFA'
                                    }}
                                >
                                    It is a long established fact that a reader will be distracted by the readable
                  </p>
                            </div>
                        </article>
                        <article className="dt pb2 mt2">
                            <div className="dtc w2">
                                <img src="http://mrmrs.github.io/photos/p/2.jpg" className="ba b--black-10 db br-100 w2 h2" />
                            </div>
                            <div className="dtc v-mid pl3">
                                <h1 className="f6 fw6 lh-title black mv0">Md Saiful Islam </h1>
                                <p
                                    className="pa2 br3 mt2"
                                    style={{
                                        backgroundColor: '#F2FAFA'
                                    }}
                                >
                                    It is a long established fact that a reader will be distracted by the readable
                  </p>
                            </div>
                        </article>
                        <article className="dt pb2 mt2">
                            <div className="dtc w2">
                                <img src="http://mrmrs.github.io/photos/p/2.jpg" className="ba b--black-10 db br-100 w2 h2" />
                            </div>
                            <div className="dtc v-mid pl3">
                                <h1 className="f6 fw6 lh-title black mv0">Md Saiful Islam </h1>
                                <p
                                    className="pa2 br3 mt2"
                                    style={{
                                        backgroundColor: '#F2FAFA'
                                    }}
                                >
                                    It is a long established fact that a reader will be distracted by the readable
                  </p>
                            </div>
                        </article>
                        <article className="dt pb2 mt2">
                            <div className="dtc w2">
                                <img src="http://mrmrs.github.io/photos/p/2.jpg" className="ba b--black-10 db br-100 w2 h2" />
                            </div>
                            <div className="dtc v-mid pl3">
                                <h1 className="f6 fw6 lh-title black mv0">Md Saiful Islam </h1>
                                <p
                                    className="pa2 br3 mt2"
                                    style={{
                                        backgroundColor: '#F2FAFA'
                                    }}
                                >
                                    It is a long established fact that a reader will be distracted by the readable
                  </p>
                            </div>
                        </article>
                        <article className="dt pb2 mt2">
                            <div className="dtc w2">
                                <img src="http://mrmrs.github.io/photos/p/2.jpg" className="ba b--black-10 db br-100 w2 h2" />
                            </div>
                            <div className="dtc v-mid pl3">
                                <h1 className="f6 fw6 lh-title black mv0">Md Saiful Islam </h1>
                                <p
                                    className="pa2 br3 mt2"
                                    style={{
                                        backgroundColor: '#F2FAFA'
                                    }}
                                >
                                    It is a long established fact that a reader will be distracted by the readable
                  </p>
                            </div>
                        </article>
                    </div>
                </div>
            </Card>
        </div>
    );
}
