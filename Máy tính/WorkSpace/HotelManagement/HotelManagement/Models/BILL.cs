//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace HotelManagement.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class BILL
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public BILL()
        {
            this.BILLDETAILs = new HashSet<BILLDETAIL>();
        }
    
        public int BILLID { get; set; }
        public int BOOKINGID { get; set; }
        public System.DateTime BEGINDATE { get; set; }
        public System.DateTime ENDDATE { get; set; }
        public long TOTALMONEY { get; set; }
        public string CREATEDUSER { get; set; }
        public Nullable<System.DateTime> CREATEDDATE { get; set; }
        public int ISDELETED { get; set; }
        public string DELETEDUSER { get; set; }
        public Nullable<System.DateTime> DELETEDATE { get; set; }
        public Nullable<System.DateTime> UPDATEDDATE { get; set; }
    
        public virtual BOOKINGROOM BOOKINGROOM { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<BILLDETAIL> BILLDETAILs { get; set; }
    }
}
