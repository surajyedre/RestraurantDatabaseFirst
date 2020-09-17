using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using RestaurantAPI.Models;

namespace RestaurantAPI.Controllers
{
    public class OrderController : ApiController
    {
        private DBModel db = new DBModel();

        // GET: api/Order
        public System.Object GetOrders()
        {
            var result = (from a in db.Orders
                          join b in db.Customers on a.CustomerID equals b.CustomerId
                          select new
                          {
                              a.OrderId,
                              a.OrderNo,
                              Customer = b.Name,
                              a.PaymentMethod,
                              a.GrandTotal
                          }).ToList();

            return result;
        }

        // GET: api/Order/5
        [ResponseType(typeof(Order))]
        public IHttpActionResult GetOrder(long id)
        {
            var order = (from a in db.Orders
                         where a.OrderId == id
                         select new
                         {
                             a.OrderId,
                             a.OrderNo,
                             a.CustomerID,
                             a.PaymentMethod,
                             a.GrandTotal
                         }).FirstOrDefault();

            var orderItems = (from a in db.OrderItems
                              join b in db.Items on a.ItemId equals b.ItemID
                              where a.OrderId == id
                              select new
                              {
                                  a.OrderId,
                                  a.OrderItemId,
                                  a.ItemId,
                                  ItemName = b.Name,
                                  b.Price,
                                  a.Quantity,
                                  Total = b.Price * a.Quantity
                              }).ToList();

            return Ok(new { order, orderItems });
        }

        // PUT: api/Order/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutOrder(long id, Order order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != order.OrderId)
            {
                return BadRequest();
            }

            db.Entry(order).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Order
        [ResponseType(typeof(Order))]
        public IHttpActionResult PostOrder(Order order)
        {
            try
            {
                //order table
                db.Orders.Add(order);


                //order-item table
                foreach (var item in order.OrderItems)
                {
                    db.OrderItems.Add(item);
                }

                db.SaveChanges();

                return Ok(); // CreatedAtRoute("DefaultApi", new { id = order.OrderId }, order);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            
        }

        // DELETE: api/Order/5
        [ResponseType(typeof(Order))]
        public IHttpActionResult DeleteOrder(long id)
        {
            Order order = db.Orders.Find(id);
            if (order == null)
            {
                return NotFound();
            }

            db.Orders.Remove(order);
            db.SaveChanges();

            return Ok(order);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OrderExists(long id)
        {
            return db.Orders.Count(e => e.OrderId == id) > 0;
        }
    }
}