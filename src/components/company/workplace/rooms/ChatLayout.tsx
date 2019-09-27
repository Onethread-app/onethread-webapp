import React, { useState } from 'react';
import { Button, Collapse, Pre } from '@blueprintjs/core';

export const ChatLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide" : "Show"} build logs
                </Button>
      <Collapse isOpen={isOpen}>
        <Pre>Dummy text.</Pre>
      </Collapse>
    </div>
  )
}
