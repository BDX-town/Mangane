import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { changeReportComment, changeReportRule } from 'soapbox/actions/reports';
import { fetchRules } from 'soapbox/actions/rules';
import { FormGroup, Stack, Text, Textarea } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import type { Set as ImmutableSet } from 'immutable';
import type { ReducerAccount } from 'soapbox/reducers/accounts';

const messages = defineMessages({
  placeholder: { id: 'report.placeholder', defaultMessage: 'Additional comments' },
  reasonForReporting: { id: 'report.reason.title', defaultMessage: 'Reason for reporting' },
});

interface IReasonStep {
  account: ReducerAccount
}

const RULES_HEIGHT = 385;

const ReasonStep = (_props: IReasonStep) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const rulesListRef = useRef(null);

  const [isNearBottom, setNearBottom] = useState<boolean>(false);
  const [isNearTop, setNearTop] = useState<boolean>(true);

  const comment = useAppSelector((state) => state.reports.getIn(['new', 'comment']) as string);
  const rules = useAppSelector((state) => state.rules.items);
  const ruleIds = useAppSelector((state) => state.reports.getIn(['new', 'rule_ids']) as ImmutableSet<string>);
  const shouldRequireRule = rules.length > 0;

  const selectedStatusIds = useAppSelector((state) => state.reports.getIn(['new', 'status_ids']) as ImmutableSet<string>);
  const isReportingAccount = useMemo(() => selectedStatusIds.size === 0, []);

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(changeReportComment(event.target.value));
  };

  const handleRulesScrolling = () => {
    if (rulesListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = rulesListRef.current;

      if (scrollTop + clientHeight > scrollHeight - 24) {
        setNearBottom(true);
      } else {
        setNearBottom(false);
      }

      if (scrollTop < 24) {
        setNearTop(true);
      } else {
        setNearTop(false);
      }
    }
  };

  const filterRuleType = (rule: any) => {
    const ruleTypeToFilter = isReportingAccount ? 'account' : 'content';

    if (rule.rule_type) {
      return rule.rule_type === ruleTypeToFilter;
    }

    return true;
  };

  useEffect(() => {
    dispatch(fetchRules());
  }, []);

  useEffect(() => {
    if (rules.length > 0 && rulesListRef.current) {
      const { clientHeight } = rulesListRef.current;

      if (clientHeight <= RULES_HEIGHT) {
        setNearBottom(true);
      }
    }
  }, [rules, rulesListRef.current]);

  return (
    <Stack space={4}>
      {shouldRequireRule && (
        <Stack space={2}>
          <Text size='xl' weight='semibold' tag='h1'>
            {intl.formatMessage(messages.reasonForReporting)}
          </Text>

          <div className='relative'>
            <div
              style={{ maxHeight: RULES_HEIGHT }}
              className='rounded-lg -space-y-px overflow-y-auto'
              onScroll={handleRulesScrolling}
              ref={rulesListRef}
            >
              {rules.filter(filterRuleType).map((rule, idx) => {
                const isSelected = ruleIds.includes(String(rule.id));

                return (
                  <button
                    key={idx}
                    data-testid={`rule-${rule.id}`}
                    onClick={() => dispatch(changeReportRule(rule.id))}
                    className={classNames({
                      'relative border border-solid border-gray-200 dark:border-slate-900/75 hover:bg-gray-50 dark:hover:bg-slate-900/50 text-left w-full p-4 flex justify-between items-center cursor-pointer': true,
                      'rounded-tl-lg rounded-tr-lg': idx === 0,
                      'rounded-bl-lg rounded-br-lg': idx === rules.length - 1,
                      'bg-gray-50 dark:bg-slate-900': isSelected,
                    })}
                  >
                    <Stack className='mr-3'>
                      <Text
                        tag='span'
                        size='sm'
                        weight='medium'
                        theme={isSelected ? 'primary' : 'default'}
                      >
                        {rule.text}
                      </Text>
                      <Text tag='span' theme='muted' size='sm'>{rule.subtext}</Text>
                    </Stack>

                    <input
                      name='reason'
                      type='checkbox'
                      value={rule.id}
                      checked={isSelected}
                      readOnly
                      className='h-4 w-4 cursor-pointer text-primary-600 dark:text-primary-400 border-gray-300 rounded focus:ring-primary-500'
                    />
                  </button>
                );
              })}
            </div>

            <div
              className={classNames('inset-x-0 top-0 flex rounded-t-lg justify-center bg-gradient-to-b from-white pb-12 pt-8 pointer-events-none dark:from-slate-900 absolute transition-opacity duration-500', {
                'opacity-0': isNearTop,
                'opacity-100': !isNearTop,
              })}
            />
            <div
              className={classNames('inset-x-0 bottom-0 flex rounded-b-lg justify-center bg-gradient-to-t from-white pt-12 pb-8 pointer-events-none dark:from-slate-900 absolute transition-opacity duration-500', {
                'opacity-0': isNearBottom,
                'opacity-100': !isNearBottom,
              })}
            />
          </div>
        </Stack>
      )}

      <FormGroup labelText={intl.formatMessage(messages.placeholder)}>
        <Textarea
          placeholder={intl.formatMessage(messages.placeholder)}
          value={comment}
          onChange={handleCommentChange}
        />
      </FormGroup>
    </Stack>
  );
};

export default ReasonStep;
