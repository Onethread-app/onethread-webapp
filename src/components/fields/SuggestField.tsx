import * as React from 'react';
import { Suggest } from "@blueprintjs/select";
import { MenuItem, Intent } from '@blueprintjs/core';
import { includes, lowerCase, isEqual, findIndex } from 'lodash';
import { useState } from 'react';
export interface ItemEntityProps {
  _id?: string;
  name: string | null;
}

interface SuggestFieldProps {
  items: ItemEntityProps[];
  selectedItems: ItemEntityProps | ItemEntityProps[] | any;
  setSelectedItems: ((item: ItemEntityProps | ItemEntityProps[] | any) => void)
  onChange?: (query: string) => void;
  isCreatable?: boolean;
  isCreatableAPI?: (obj: { name: string }) => void
  multipleItemSelect?: boolean;
}

const SuggestInput = Suggest.ofType<ItemEntityProps>();

export const SuggestField = (props: SuggestFieldProps) => {

  const [currentQuery, setCurrentQuery] = useState({} as ItemEntityProps);

  return (
    <SuggestInput
      initialContent={null}
      onQueryChange={props.onChange}
      items={props.items}
      itemListPredicate={item => props.items.filter(s => includes(lowerCase(s.name!), lowerCase(item)))}
      itemRenderer={item =>
        <MenuItem
          key={item._id}
          onClick={(e: any) => {
            if (props.multipleItemSelect === true) {
              if ((props.selectedItems as any).filter((si: any) => isEqual(item.name, si.name)).length === 0) {
                props.setSelectedItems([
                  ...(props.selectedItems as any),
                  item
                ])
              } else {
                const index = findIndex(props.selectedItems as any, { '_id': item._id, 'name': item.name });
                (props.selectedItems as any).splice(index, 1);
                props.setSelectedItems([
                  ...props.selectedItems as any
                ])
              }
            } else {
              // select single item
              props.setSelectedItems(item);
              setCurrentQuery(item);
            }
          }}
          text={item.name}
          intent={props.multipleItemSelect === true ?
            (props.selectedItems as any).filter((si: any) => isEqual(item.name, si.name)).length > 0 ? Intent.PRIMARY : Intent.NONE
            : isEqual(item.name, (props.selectedItems as ItemEntityProps).name) ? Intent.PRIMARY : Intent.NONE
          }
          icon={props.multipleItemSelect === true ?
            (props.selectedItems as any).filter((si: any) => isEqual(item.name, si.name)).length > 0 ? 'tick' : 'square'
            : isEqual(item.name, (props.selectedItems as ItemEntityProps).name) ? 'tick' : 'square'
          }
        />
      }
      // noResults={
      //   props.isCreatable ?
      //     <MenuItem
      //       text={`Add this name`}
      //       icon="new-object"
      //       intent={Intent.PRIMARY}
      //       onClick={async (e: any) => {
      //         console.log(`new item create button clicked`, e);
      //         // const newItem = {name: e};
      //         // if (props.isCreatableAPI) {
      //         //   const response = await props.isCreatableAPI(newItem);
      //         //   props.selectedItems.push(response);
      //         // }
      //       }}
      //     /> :
      //     <MenuItem
      //       text={`No Result Found`}
      //       intent={Intent.WARNING}
      //     />
      // }
      createNewItemFromQuery={(query: string) => {
        return {
          _id: undefined,
          name: query
        };
      }}
      createNewItemRenderer={item => {
        return props.isCreatable === true ?
          <MenuItem
            text={item}
            icon="new-object"
            intent={Intent.PRIMARY}
            onClick={async (e: any) => {
              const newItem = { name: item };
              if (props.isCreatableAPI) {
                await props.isCreatableAPI(newItem);
              }
            }}
          />
          : !props.isCreatable === true && props.items.length === 0 ? 
          <MenuItem
            text="No result found"
            icon="blank"
            intent={Intent.WARNING}
            onClick={async (e: any) => {
              console.log(`No item found clicked`)
            }}
          /> : undefined
      }}
      onItemSelect={selectedSkill => console.log(selectedSkill)}
      closeOnSelect={false}
      resetOnClose={true}
      popoverProps={{
        minimal: true,
        popoverClassName: 'max-h5 overflow-auto',
      }}
      fill={true}
      inputValueRenderer={(item: ItemEntityProps) => item.name!}
      selectedItem={currentQuery}
    />
  )
}
