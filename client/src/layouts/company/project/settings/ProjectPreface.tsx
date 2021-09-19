import { useState } from 'react';
import { connect } from 'react-redux';

import { Field } from 'react-final-form';

const PrefacePageComponent = (props: any) => {
  const [disabled] = useState(false);

  return (
    <div>
      <p className="b f5 mb3">Project Preface</p>
      <div className="mb3">
        <Field<string>
          name="optionalRole"
          type="checkbox"
          render={({ input, meta }) => (
            <label
              className={`flex items-center mb2 ${
                disabled ? 'not-allowed' : 'pointer'
              }`}
            >
              <Field
                name="optionalRole"
                className="mr2"
                component="input"
                type="checkbox"
                value="updateProjectPreface"
                disabled={disabled}
              />
              Update info's in Project Preface
            </label>
          )}
        />
        <Field<string>
          name="optionalRole"
          type="checkbox"
          render={({ input, meta }) => (
            <label
              className={`flex items-center mb2 ${
                disabled ? 'not-allowed' : 'pointer'
              }`}
            >
              <Field
                name="optionalRole"
                className="mr2"
                component="input"
                type="checkbox"
                value="addFileProject"
                disabled={disabled}
              />
              Add files in Project Preface
            </label>
          )}
        />
      </div>
    </div>
  );
};

export const PrefacePage = connect(null, null)(PrefacePageComponent);
