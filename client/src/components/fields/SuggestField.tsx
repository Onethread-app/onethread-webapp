import * as React from 'react';
import { useState } from 'react';
import { includes, lowerCase, isEqual, findIndex } from 'lodash';

import { Suggest } from '@blueprintjs/select';
import { MenuItem } from '@blueprintjs/core/lib/esm/components/menu/menuItem';
import { Intent } from '@blueprintjs/core/lib/esm/common/intent';

import { capitalizeName } from 'stores/UtilsActions';

export interface ItemEntityProps {
  _id?: string;
  email?: string;
  name: string | null;
  mongo_id?: string;
}

interface SuggestFieldProps {
  items: ItemEntityProps[];
  selectedItems: ItemEntityProps | ItemEntityProps[] | any;
  setSelectedItems: (
    item: ItemEntityProps | ItemEntityProps[] | any,
  ) => void;
  onChange?: (query: string) => void;
  isCreatable?: boolean;
  isCreatableAPI?: (obj: { name: string }) => void;
  multipleItemSelect?: boolean;
  error?: string;
  className?: string | '';
}

const SuggestInput = Suggest.ofType<ItemEntityProps>();

export const SuggestField = (props: SuggestFieldProps) => {
  const [currentQuery, setCurrentQuery] = useState(
    {} as ItemEntityProps,
  );

  return (
    <SuggestInput
      className={props.className}
      initialContent={null}
      onQueryChange={props.onChange}
      items={props.items}
      itemListPredicate={(item) =>
        props.items.filter((s) =>
          s.email
            ? includes(lowerCase(s.email!), lowerCase(item))
            : includes(lowerCase(s.name!), lowerCase(item)),
        )
      }
      itemRenderer={(item) => (
        <MenuItem
          key={item._id}
          onClick={(e: any) => {
            if (props.multipleItemSelect === true) {
              if (
                (props.selectedItems as any).filter((si: any) =>
                  isEqual(item.name, si.name),
                ).length === 0
              ) {
                props.setSelectedItems([
                  ...(props.selectedItems as any),
                  item,
                ]);
              } else {
                const index = findIndex(props.selectedItems as any, {
                  _id: item._id,
                  name: item.name,
                });
                (props.selectedItems as any).splice(index, 1);
                props.setSelectedItems([
                  ...(props.selectedItems as any),
                ]);
              }
            } else {
              // select single item
              props.setSelectedItems(item);
              setCurrentQuery(item);
            }
          }}
          text={
            item.email ? (
              <div className="flex justify-start items-center">
                <h5 className="ma0 mr1">
                  {capitalizeName(item.email)}
                </h5>
                <small>({item.name})</small>
              </div>
            ) : (
              item.name
            )
          }
          intent={
            props.multipleItemSelect === true
              ? (props.selectedItems as any).filter((si: any) =>
                  isEqual(item.name, si.name),
                ).length > 0
                ? Intent.PRIMARY
                : Intent.NONE
              : isEqual(
                  item.name,
                  (props.selectedItems as ItemEntityProps).name,
                )
              ? Intent.PRIMARY
              : Intent.NONE
          }
          icon={
            props.multipleItemSelect === true
              ? (props.selectedItems as any).filter((si: any) =>
                  isEqual(item.name, si.name),
                ).length > 0
                ? 'tick'
                : 'square'
              : isEqual(
                  item.name,
                  (props.selectedItems as ItemEntityProps).name,
                )
              ? 'tick'
              : 'square'
          }
        />
      )}
      createNewItemFromQuery={(query: string) => {
        return {
          _id: undefined,
          name: query,
        };
      }}
      createNewItemRenderer={(item) => {
        return props.isCreatable === true ? (
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
        ) : !props.isCreatable === true &&
          props.items.length === 0 ? (
          <MenuItem
            text="No result found"
            icon="blank"
            intent={Intent.WARNING}
            onClick={async (e: any) => {
              // tslint:disable-next-line: no-console
            }}
          />
        ) : undefined;
      }}
      onItemSelect={(selectedSkill) => {
        // tslint:disable-next-line: no-console
      }}
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
  );
};

export const SuggestFieldWithError = (props: SuggestFieldProps) => (
  <>
    <SuggestField {...props} />
    {props.error && (
      <small style={{ color: 'red' }}>{props.error}</small>
    )}
  </>
);
