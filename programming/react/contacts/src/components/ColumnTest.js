import React from 'react';
import '../styles/ColumnLayouts.css'

function ColumnTest(props) {
	return (
		<div id="colTest" className="bob" style={{"border": "1px solid #333333", "backgroundColor": "#aaaaaa"}}>
			<div>
				<div className="col-1" style={{"backgroundColor": 'hsla(0, 100%, 50%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-2" style={{"backgroundColor": 'hsla(45, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-2" style={{"backgroundColor": 'hsla(45, 90%, 90%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-3" style={{"backgroundColor": 'hsla(90, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-3" style={{"backgroundColor": 'hsla(90, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-3" style={{"backgroundColor": 'hsla(90, 80%, 80%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-3" style={{"backgroundColor": 'hsla(90, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-2of3" style={{"backgroundColor": 'hsla(90, 90%, 90%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-4" style={{"backgroundColor": 'hsla(135, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-4" style={{"backgroundColor": 'hsla(135, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-4" style={{"backgroundColor": 'hsla(135, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-4" style={{"backgroundColor": 'hsla(135, 70%, 70%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-4" style={{"backgroundColor": 'hsla(135, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-4" style={{"backgroundColor": 'hsla(135, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-2of4" style={{"backgroundColor": 'hsla(135, 80%, 80%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-4" style={{"backgroundColor": 'hsla(135, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-3of4" style={{"backgroundColor": 'hsla(135, 90%, 90%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-5" style={{"backgroundColor": 'hsla(180, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-5" style={{"backgroundColor": 'hsla(180, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-5" style={{"backgroundColor": 'hsla(180, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-5" style={{"backgroundColor": 'hsla(180, 70%, 70%, 1)'}}>&nbsp;</div>
				<div className="col-5" style={{"backgroundColor": 'hsla(180, 60%, 60%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-5" style={{"backgroundColor": 'hsla(180, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-5" style={{"backgroundColor": 'hsla(180, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-5" style={{"backgroundColor": 'hsla(180, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-2of5" style={{"backgroundColor": 'hsla(180, 70%, 70%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-5" style={{"backgroundColor": 'hsla(180, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-5" style={{"backgroundColor": 'hsla(180, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-3of5" style={{"backgroundColor": 'hsla(180, 80%, 80%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-5" style={{"backgroundColor": 'hsla(180, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-4of5" style={{"backgroundColor": 'hsla(180, 90%, 90%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 70%, 70%, 1)'}}>&nbsp;</div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 60%, 60%, 1)'}}>&nbsp;</div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 50%, 50%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 70%, 70%, 1)'}}>&nbsp;</div>
				<div className="col-2of6" style={{"backgroundColor": 'hsla(225, 60%, 60%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-3of6" style={{"backgroundColor": 'hsla(225, 70%, 70%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-4of6" style={{"backgroundColor": 'hsla(225, 80%, 80%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-6" style={{"backgroundColor": 'hsla(225, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-5of6" style={{"backgroundColor": 'hsla(225, 90%, 90%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 70%, 70%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 60%, 60%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 50%, 50%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 40%, 40%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 70%, 70%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 60%, 60%, 1)'}}>&nbsp;</div>
				<div className="col-2of7" style={{"backgroundColor": 'hsla(270, 50%, 50%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 70%, 70%, 1)'}}>&nbsp;</div>
				<div className="col-3of7" style={{"backgroundColor": 'hsla(270, 60%, 60%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-4of7" style={{"backgroundColor": 'hsla(270, 70%, 70%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-5of7" style={{"backgroundColor": 'hsla(270, 80%, 80%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-7" style={{"backgroundColor": 'hsla(270, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-6of7" style={{"backgroundColor": 'hsla(270, 90%, 90%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 70%, 70%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 60%, 60%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 50%, 50%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 40%, 40%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 30%, 30%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 70%, 70%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 60%, 60%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 50%, 50%, 1)'}}>&nbsp;</div>
				<div className="col-2of8" style={{"backgroundColor": 'hsla(315, 40%, 40%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 70%, 70%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 60%, 60%, 1)'}}>&nbsp;</div>
				<div className="col-3of8" style={{"backgroundColor": 'hsla(315, 50%, 50%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 70%, 70%, 1)'}}>&nbsp;</div>
				<div className="col-4of8" style={{"backgroundColor": 'hsla(315, 60%, 60%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 80%, 80%, 1)'}}>&nbsp;</div>
				<div className="col-5of8" style={{"backgroundColor": 'hsla(315, 70%, 70%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 90%, 90%, 1)'}}>&nbsp;</div>
				<div className="col-6of8" style={{"backgroundColor": 'hsla(315, 80%, 80%, 1)'}}>&nbsp;</div>
			</div>
			<div>
				<div className="col-8" style={{"backgroundColor": 'hsla(315, 100%, 98%, 1)'}}>&nbsp;</div>
				<div className="col-7of8" style={{"backgroundColor": 'hsla(315, 90%, 90%, 1)'}}>&nbsp;</div>
			</div>
		</div>
	);
}

export default ColumnTest;
