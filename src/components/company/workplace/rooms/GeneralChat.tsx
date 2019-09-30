import React from 'react';
import user from '../../../../resources/images/user.png';
import { ListItemViewWithRoundedImage } from 'components/common/ListItemViewWithRoundedImage';

export const GeneralChatComponent = (props: any) => {
  return(
    <>
    <div className="relative" >
      <div>
    <ListItemViewWithRoundedImage
                  imageSrc={user}
                  listDescription="It is a long established fact that 
                  a reader will be distracted bythe readable It is a long
                  It is a long established fact that 
                  a reader will be distracted bythe readable It is a long
                  It is a long established fact that a reader will be distracted
                   by the readable It is a long established fact that a reader"
    
    />
 
    </div>
    </div>
    </>

  )
}