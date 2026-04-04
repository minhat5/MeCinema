import {
  Group,
  Modal as MantineModal,
  Text,
  type ModalProps as MantineModalProps,
} from '@mantine/core';
import type React from 'react';
import { Button } from './Button';

export interface ModalProps extends Omit<
  MantineModalProps,
  'children' | 'opened' | 'onClose' | 'title'
> {
  opened: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  description?: React.ReactNode;
  showFooter?: boolean;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  confirmLoading?: boolean;
  hideCancelButton?: boolean;
  isDark?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  children,
  description,
  showFooter = false,
  cancelText = 'Hủy',
  confirmText = 'Xác nhận',
  onConfirm,
  confirmLoading = false,
  hideCancelButton = false,
  isDark = false,
  ...modalProps
}) => {
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      radius="lg"
      overlayProps={
        isDark ? {
          backgroundOpacity: 0.55,
          blur: 3,
        } : {}
      }
      classNames={
        isDark ? {
          title: 'text-base font-semibold text-[#dae2fd]',
          body: 'bg-[#131b2e]',
          content: 'bg-[#131b2e] border border-[#424656]/30',
          header: 'bg-[#131b2e] border-b border-[#424656]/30',
          close: 'text-[#b3c5ff] hover:text-[#dae2fd]',
        } : {
          title: 'text-base font-semibold text-slate-900',
          body: 'pt-1',
        }
      }
      styles={
        isDark ? {
          content: {
            backgroundColor: '#131b2e',
            borderColor: '#424656',
          },
          header: {
            backgroundColor: '#131b2e',
            borderBottomColor: '#424656',
          },
        } : {}
      }
      {...modalProps}
    >
      <div className="space-y-5">
        {description ? (
          <Text size="sm" c={isDark ? '#b3c5ff' : 'dimmed'} className="leading-relaxed">
            {description}
          </Text>
        ) : null}

        {children}

        {showFooter && (
          <Group
            justify="flex-end"
            gap="sm"
            className={`pt-2 border-t ${isDark ? 'border-[#424656]/30' : 'border-slate-200'}`}
          >
            {!hideCancelButton && (
              <Button
                variant="default"
                onClick={onClose}
                disabled={confirmLoading}
              >
                {cancelText}
              </Button>
            )}
            <Button
              onClick={onConfirm}
              loading={confirmLoading}
              disabled={!onConfirm}
            >
              {confirmText}
            </Button>
          </Group>
        )}
      </div>
    </MantineModal>
  );
};
