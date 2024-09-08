"use client"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
//@ts-ignore
export const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent className="bg-slate-900 text-white rounded-lg shadow-lg">
                <ModalHeader className="text-xl font-semibold border-b border-slate-800 p-4">
                    Confirm Logout
                </ModalHeader>
                <ModalBody className="p-6 text-sm">
                    Are you sure you want to log out?
                </ModalBody>
                <ModalFooter className="border-t border-slate-800 p-4">
                    <Button 
                        colorScheme="red" 
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-3" 
                        onClick={onConfirm}
                    >
                        Yes, Log out
                    </Button>
                    <Button 
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded" 
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
