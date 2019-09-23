import * as React from 'react';
import { Suggest } from "@blueprintjs/select";
import { MenuItem, Intent } from '@blueprintjs/core';
import { includes, lowerCase, isEqual, findIndex } from 'lodash';
export interface ItemEntityProps {
  id?: string;
  name: string;
}

interface SuggestFieldProps {
  items: ItemEntityProps[];
  selectedItems: ItemEntityProps[];
  setSelectedItems: ((item: ItemEntityProps[]) => void)
}

const SuggestInput = Suggest.ofType<ItemEntityProps>();

export const SuggestField = (props: SuggestFieldProps) => {
  return (
    <>
      <SuggestInput
        items={props.items}
        itemListPredicate={item => props.items.filter(s => includes(lowerCase(s.name), lowerCase(item)))}
        itemRenderer={item =>
          <MenuItem
            key={item.id}
            // label={item.name}
            onClick={(e: any) => {
              if (props.selectedItems.filter(si => isEqual(item.name, si.name)).length === 0) {
                props.setSelectedItems([
                  ...props.selectedItems,
                  item
                ])
              } else {
                const index = findIndex(props.selectedItems, { 'id': item.id, 'name': item.name });
                props.selectedItems.splice(index, 1);
                props.setSelectedItems([
                  ...props.selectedItems
                ])
              }
            }}
            text={item.name}
            intent={props.selectedItems.filter(si => isEqual(item.name, si.name)).length > 0 ? Intent.PRIMARY : Intent.NONE}
            icon={props.selectedItems.filter(si => isEqual(item.name, si.name)).length > 0 ? 'tick' : 'square'}
          />
        }
        noResults={<MenuItem disabled={true} text="No results." />}
        onItemSelect={selectedSkill => console.log(selectedSkill)}
        closeOnSelect={false}
        createNewItemFromQuery={query => ({ name: query })}
        createNewItemRenderer={(selectedItem) => (
          <MenuItem
            text={`Create ${selectedItem}`}
            icon={'new-object'}
            onClick={(e: any) => {
              props.setSelectedItems([
                ...props.selectedItems,
                { name: selectedItem }
              ])
            }}
          />
        )}
        resetOnClose={true}
        popoverProps={{
          minimal: true
        }}
        fill={true}
        inputValueRenderer={(item: ItemEntityProps) => item.name}
      />
    </>
  )
}
