import React, { useState } from 'react';
import ReactJson from 'react-json-view'

export default ( props ) => {
	const { parsedJson } = props;

	return (
		<ReactJson src={parsedJson} theme='apathy' iconStyle='square' displayDataTypes={false}/>
	);
};
