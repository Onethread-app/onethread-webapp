import React, { useState } from 'react'
import { SuggestField, ItemEntityProps } from 'components/common/field/SuggestField';
import { Tag, Button } from '@blueprintjs/core';

interface AddTeamMemberFormProps {
  setShowAddMemberFormDialog?: (val: boolean) => void;
}

const skills = [
  { _id: '1', name: 'Mithhu' },
  { _id: '2', name: 'Labiba' },
  { _id: '3', name: 'Nizam' },
  { _id: '4', name: 'Arif' },
  { _id: '5', name: 'Orvi' },
]

export const AddTeamMemberForm = (props: AddTeamMemberFormProps) => {

  // TODO Should comes from redux store
  const [selectedItems, setSelectedItems] = useState([] as ItemEntityProps[]);

  return (
    <div className="pa3 bg-white cf">
      <div className="fl w-100 pv2">
        <SuggestField
          items={skills}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
      <div className="fl w-100 mb2">
        {selectedItems.map(item => (
          <Tag
            key={item._id}
            className="ma1 pa2"
            interactive={true}
            intent="primary"
            onRemove={e => {
              const filteredItems = selectedItems.filter(selectedItem => (
                item.name !== selectedItem.name
              ));
              setSelectedItems([
                ...filteredItems
              ])
            }}
            large={true}
          >
            {item.name}
          </Tag>
        ))}
      </div>
      <div className="fl w-100">
        <div className="flex justify-end">
          <Button className="w4 grow h2 pointer mr3"
            onClick={(e: any) => {
              e.preventDefault();
              if (props.setShowAddMemberFormDialog) {
                props.setShowAddMemberFormDialog(false);
              }
            }}
            style={{ background: "#fff", outline: "none", border: "2px solid #0fa3a3", color: "#0fa3a3" }}
          >
            cancel
            </Button>
          <Button
            type="submit"
            onClick={(e: any) => {
              e.preventDefault();
              if (props.setShowAddMemberFormDialog)
                props.setShowAddMemberFormDialog(false);
            }}
            className="w4 grow h2 pointer"
            style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
          >
            Add
            </Button>
        </div>
      </div>

    </div>
  )
}
