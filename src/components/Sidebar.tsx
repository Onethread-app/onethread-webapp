import React from 'react'
import { Collapse, ButtonGroup, Alignment, Button } from '@blueprintjs/core'

export const Sidebar = () => {
  // const [showCollapse, setShowCollapse] = useState(false);
  return (
          // {showCollapse && 
          <Collapse isOpen keepChildrenMounted>
            <div className=" bg-white">
              <ButtonGroup alignText={Alignment.LEFT} className="bp3-minimal bp3-vertical bp3-fill" >
                <Button className="mv2" icon="control">Workplace</Button>
                <Button className="mv2" icon="user">Profile</Button>
                <Button className="mv2" icon="briefcase">Product</Button>
                <Button className="mv2" icon="properties">About</Button>
                <Button className="mv2" icon="function">Expo</Button>
                <Button className="mv2" icon="people">Admin panel</Button>
              </ButtonGroup>
            </div>
          </Collapse>
          // }
  );
}
