import React from 'react'
import { Collapse, ButtonGroup, Alignment, Button } from '@blueprintjs/core'

export const Sidebar = () => {
  // const [showCollapse, setShowCollapse] = useState(false);
  return (
          // {showCollapse && 
          <Collapse isOpen keepChildrenMounted>
            <div className=" bg-white  mv4 pv3 ">
              <ButtonGroup alignText={Alignment.LEFT} className="bp3-minimal bp3-vertical bp3-large bp3-fill" >
                <Button icon="control">Workplace</Button>
                <Button icon="user">Profile</Button>
                <Button icon="briefcase">Product</Button>
                <Button icon="properties">About</Button>
                <Button icon="function">Expo</Button>
                <Button icon="people">Admin panel</Button>
              </ButtonGroup>
            </div>
          </Collapse>
          // }
  );
}
