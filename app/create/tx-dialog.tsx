import { Spinner } from "@nextui-org/spinner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

export function TxDialog({
  isOpen,
  onOpenChange,
  failedMessage,
  txDigest,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  failedMessage: string;
  txDigest: string;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Creating Pool and Stream
            </ModalHeader>
            <ModalBody className="flex flex-col items-center justify-center py-8">
              {!failedMessage && !txDigest && (
                <>
                  <Spinner size="lg" />
                  <p className="text-sm text-gray-500 text-center">
                    Please wait
                  </p>
                </>
              )}
              {failedMessage && (
                <p className="text-red-500 text-center">{failedMessage}</p>
              )}
              {txDigest && (
                <p className="text-green-500 text-center">{txDigest}</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                onPress={onClose}
                isDisabled={!txDigest && !failedMessage}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
