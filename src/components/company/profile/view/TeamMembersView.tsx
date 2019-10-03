import React, { useState } from 'react';
import { Button, HTMLTable, Dialog, Tag } from '@blueprintjs/core';
import { SuggestField, ItemEntityProps } from 'components/common/field/SuggestField';

const TeamMembers = [
  { id: '1', name: 'Labiba' },
  { id: '2', name: 'Mithhu' },
  { id: '3', name: 'Arif' },
  { id: '4', name: 'Nizam' },
  { id: '5', name: 'Mahdi' },
]

export const CompanyTeamMembersView = () => {
  const [showDialog, setShowDialog] = useState(false);
  // Should comes from redux store
  const [selectedItems, setSelectedItems] = useState([] as ItemEntityProps[]);
  return (
    <>
      <div className="br3 bg-white h-auto pa4 mt3 cf w-100">
        <div>
          <h1 className="f5 lh-title tigrow-lightGray-1 dib">Team Members</h1>
          <Button className="grow fr h2 pointer white bp3-minimal "
            style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
            onClick={() => setShowDialog(!showDialog)}
          >
            Add Team Members
          </Button>
        </div>
        <HTMLTable
          className="w-100 mt4"
          striped={true}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Blueprint</td>
              <td>CSS framework and UI toolkit</td>
              <td>Sass, TypeScript, React</td>
            </tr>
            <tr>
              <td>TSLint</td>
              <td>Static analysis linter for TypeScript</td>
              <td>TypeScript</td>
            </tr>
            <tr>
              <td>Plottable</td>
              <td>Composable charting library built on top of D3</td>
              <td>SVG, TypeScript, D3</td>
            </tr>
          </tbody>
        </HTMLTable>
      </div>
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          title="Add Members"
          isOpen={showDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div className="pa3">
            <div className=" w-100">
              <h1 className="f5">Add members</h1>
              <SuggestField
                items={TeamMembers}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            </div>
            <div className="w-100 mb2">
              {selectedItems.map(item => (
                <Tag
                  key={item.id}
                  className="ma1 pa2"
                  interactive={true}
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

            <div className="flex justify-end">
              <Button className="grow h2 pointer white bp3-minimal w4 mr3"
                style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
              >
                Cancel
          </Button>
              <Button className="grow h2 pointer white bp3-minimal w4"
                style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
              >
                Add
          </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}
