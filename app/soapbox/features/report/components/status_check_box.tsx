import React from 'react';

import { toggleStatusReport } from 'soapbox/actions/reports';
import StatusContent from 'soapbox/components/status_content';
import { Checkbox } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

interface IStatusCheckBox {
  id: string,
  disabled?: boolean,
}

const StatusCheckBox: React.FC<IStatusCheckBox> = ({ id, disabled }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.statuses.get(id));
  const checked = useAppSelector((state) => state.reports.new.status_ids.includes(id));

  const onToggle: React.ChangeEventHandler<HTMLInputElement> = (e) => dispatch(toggleStatusReport(id, e.target.checked));

  if (!status || status.reblog) {
    return null;
  }

  return (
    <label className='flex gap-2 items-start select-none bg-gray-100 dark:bg-slate-600 rounded-lg p-2'>
      <div className='status-check-box-toggle'>
        <Checkbox checked={checked} onChange={onToggle} disabled={disabled} />
      </div>
      <div className='status-check-box__status'>
        <StatusContent status={status} />
      </div>
    </label>
  );
};

export default StatusCheckBox;
