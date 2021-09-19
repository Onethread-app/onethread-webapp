import { Intent, MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';
import React from 'react';
import './ProjectStatus.scss';

const MultiSelectComponent = ({
  container,
  placeholder,
  selected,
  setSelected,
}) => {
  const onItemSelect = (item) => {
    if (!selected.find((si) => si.label === item.label)) {
      setSelected((prev) => [...prev, item]);
    }
  };

  const handleTagRemove = (tag, index) => {
    setSelected((prev) => {
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  };
  return (
    <>
      <MultiSelect
        tagInputProps={{
          placeholder: placeholder,
          onRemove: handleTagRemove,
        }}
        fill={true}
        itemRenderer={(item) => (
          <MenuItem
            key={item.id}
            onClick={(e: any) => onItemSelect(item)}
            text={item.label}
            className="ttc"
            intent={
              selected.find((si) => si.label === item.label)
                ? Intent.PRIMARY
                : Intent.NONE
            }
            icon={
              selected.find((si) => si.label === item.label)
                ? 'tick'
                : 'square'
            }
          />
        )}
        tagRenderer={(item) => (
          <p className="ma0 white ttc"> {item.label} </p>
        )}
        items={container}
        selectedItems={selected}
        onItemSelect={onItemSelect}
      />
    </>
  );
};

export default MultiSelectComponent;
