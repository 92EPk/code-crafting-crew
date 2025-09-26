import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RotateCcw, ChevronRight } from "lucide-react";
import { SimpleOrder } from "@/types/restaurant";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface OrderStatusManagerProps {
  order: SimpleOrder;
  onStatusUpdate: (orderId: string, newStatus: SimpleOrder['status']) => void;
}

const OrderStatusManager = ({ order, onStatusUpdate }: OrderStatusManagerProps) => {
  const { language, isRTL } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState<SimpleOrder['status']>(order.status);
  const t = translations[language];

  const statusOptions: { value: SimpleOrder['status']; label: string; color: string }[] = [
    { value: 'pending', label: t.pending, color: 'bg-yellow-500' },
    { value: 'confirmed', label: t.confirmed, color: 'bg-blue-500' },
    { value: 'preparing', label: t.preparing, color: 'bg-orange-500' },
    { value: 'ready', label: t.ready, color: 'bg-green-500' },
    { value: 'delivered', label: t.delivered, color: 'bg-gray-500' },
    { value: 'cancelled', label: t.cancelled, color: 'bg-red-500' },
  ];

  const getCurrentStatusIndex = () => {
    return statusOptions.findIndex(status => status.value === order.status);
  };

  const getNextStatus = () => {
    const currentIndex = getCurrentStatusIndex();
    if (currentIndex < statusOptions.length - 2) { // Exclude 'cancelled' from normal flow
      return statusOptions[currentIndex + 1];
    }
    return null;
  };

  const getPreviousStatus = () => {
    const currentIndex = getCurrentStatusIndex();
    if (currentIndex > 0) {
      return statusOptions[currentIndex - 1];
    }
    return null;
  };

  const getCurrentStatus = () => {
    return statusOptions.find(status => status.value === order.status);
  };

  const handleStatusUpdate = (newStatus: SimpleOrder['status']) => {
    onStatusUpdate(order.id, newStatus);
  };

  const nextStatus = getNextStatus();
  const previousStatus = getPreviousStatus();
  const currentStatus = getCurrentStatus();

  return (
    <div className="space-y-4">
      {/* Current Status Display */}
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${currentStatus?.color}`}></div>
        <Badge variant="outline" className="text-sm">
          {currentStatus?.label}
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        {/* Next Status Button */}
        {nextStatus && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="sm" 
                className="flex items-center gap-2"
                variant="default"
              >
                <ChevronRight className="h-4 w-4" />
                {nextStatus.label}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
              <AlertDialogHeader>
                <AlertDialogTitle className={isRTL ? 'font-arabic' : ''}>
                  {t.confirmStatusChange}
                </AlertDialogTitle>
                <AlertDialogDescription className={isRTL ? 'font-arabic' : ''}>
                  {t.changeStatusTo} "{nextStatus.label}"?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className={isRTL ? 'font-arabic' : ''}>
                  {t.cancel}
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleStatusUpdate(nextStatus.value)}
                  className={isRTL ? 'font-arabic' : ''}
                >
                  {t.confirmStatusChange}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Revert Status Button */}
        {previousStatus && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {t.revertStatus}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
              <AlertDialogHeader>
                <AlertDialogTitle className={isRTL ? 'font-arabic' : ''}>
                  {t.revertStatus}
                </AlertDialogTitle>
                <AlertDialogDescription className={isRTL ? 'font-arabic' : ''}>
                  {t.changeStatusTo} "{previousStatus.label}"?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className={isRTL ? 'font-arabic' : ''}>
                  {t.cancel}
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleStatusUpdate(previousStatus.value)}
                  className={isRTL ? 'font-arabic' : ''}
                >
                  {t.revertStatus}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Manual Status Selector */}
      <div className="space-y-2">
        <label className={`text-sm font-medium ${isRTL ? 'font-arabic' : ''}`}>
          {t.updateStatus}:
        </label>
        <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as SimpleOrder['status'])}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                  {status.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedStatus !== order.status && (
          <Button 
            size="sm" 
            onClick={() => handleStatusUpdate(selectedStatus)}
            className="w-full"
          >
            {t.updateStatus}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderStatusManager;