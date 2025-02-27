import React, { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useOrderDetails, OrderWithDetails } from '../../hooks/useOrderDetails';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';
import { supabase } from '../../lib/supabase';
import { Order } from '../../types';

const AdminOrders: React.FC = () => {
  const { orders, loading, error } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const { order: orderDetails, loading: detailsLoading } = useOrderDetails(selectedOrder);
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setUpdateLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Refresh the page to update the list
      window.location.reload();
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">Error loading orders: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user?.first_name} {order.user?.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-primary hover:text-primary-dark"
                      onClick={() => setSelectedOrder(order.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            detailsLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ) : orderDetails ? (
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Order Details</h2>
                  <OrderStatusBadge status={orderDetails.status} />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Customer Email
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {orderDetails.user.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Order Items
                    </label>
                    <div className="mt-2 space-y-2">
                      {orderDetails.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="h-10 w-10 flex-shrink-0">
                            {item.product.images[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="h-10 w-10 rounded object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-gray-200"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ${(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">${orderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(orderDetails.id, status as Order['status'])}
                          disabled={updateLoading || orderDetails.status === status}
                          className={`px-3 py-1 text-sm font-medium rounded-full
                            ${orderDetails.status === status
                              ? 'bg-gray-100 text-gray-800 cursor-not-allowed'
                              : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">Order not found</p>
              </div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;