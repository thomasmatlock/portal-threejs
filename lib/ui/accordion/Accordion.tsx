/* eslint-disable react/display-name */
// @ts-nocheck

import React from 'react';
import * as AccordionUI from '@radix-ui/react-accordion';
import classNames from 'classnames';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import styles from './Accordion.module.scss';

const Accordion = ({ items }) => (
  <AccordionUI.Root
    className={styles.AccordionRoot}
    type="single"
    defaultValue={items[0]?.value}
    collapsible
  >
    {items.map((item) => (
      <AccordionUI.Item
        className={styles.AccordionItem}
        key={item.value}
        value={item.value}
      >
        <AccordionTrigger>
          <h5>{item.title}</h5>
        </AccordionTrigger>
        <AccordionContent>
          <p
            className={styles.AccordionContentText}
            style={{
              textAlign: 'left',
            }}
          >
            {item.content}
          </p>
        </AccordionContent>
      </AccordionUI.Item>
    ))}
  </AccordionUI.Root>
);

const AccordionTrigger = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionUI.Header className={styles.AccordionHeader}>
      <AccordionUI.Trigger
        className={classNames(styles.AccordionTrigger, className)}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <ChevronDownIcon className={styles.AccordionChevron} aria-hidden />
      </AccordionUI.Trigger>
    </AccordionUI.Header>
  ),
);

const AccordionContent = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionUI.Content
      className={classNames(styles.AccordionContent, className)}
      {...props}
      ref={forwardedRef}
    >
      <div className={styles.AccordionContentText}>{children}</div>
    </AccordionUI.Content>
  ),
);

export default Accordion;
