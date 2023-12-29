To create user
--------------
API URL: https://devbackend.dayratework.com/createuser 
HTTP Method: POST
Post Parameters : 
    {
        "email":"[EMAIL_ADDRESS]",
        "pass":"[PASSWORD]",
        "accounttype":[ACCOUNT_TYPE], /* either contractor or employer */
        "url":"https://devapp.dayratework.com/[ACTIVATE_PAGE]/"
    }
on Success Response : will send Activation email to user

To Activate user
----------------
API URL: https://devbackend.dayratework.com/activateuser
HTTP Method: POST
Post Parameters : 
    {
        "encdata":"[ENCRYPTED_DATA_FROM_ACTIVATION_URL]",
        "url":"https://devapp.dayratework.com/[ACTIVATE_PAGE]/" /* for resend activation link if expired after 24 hours */
    }
on link expiry Response : will resend the new Activation link email

To create the user based on SSO login
-------------------------------------
API URL: https://devbackend.dayratework.com/createusersso
HTTP Method: POST
Post Parameters : 
    {
        "email":"[EMAIL_ADDRESS]",
        "accounttype":[ACCOUNT_TYPE], /* default to contractor */
        "logintype":"[EX: GOOGLE, TWITTER or FACEBOOK]",
        "loginuniqid":"[EX: GOOGLE ID return after SSO signin]"
    }
on Success Response :
    {
        status:true, 
        user:[user id], 
        token:[authorizetoken] /* must store and send back(as header on each request) to retrieve data after login */
    }

To Login user       
----------------
API URL: https://devbackend.dayratework.com/checkuser
HTTP Method: POST
Post Parameters :
    {
	"email":"[EMAIL_ADDRESS]",
	"pass":"[PASSWORD]",
    }

if 2FA Enabled
    on Success Response : will send the OTPCODE to user email
otherwise
    on Success Response :
    {
        status:true, 
        user:[user_data], 
        token:[authorizetoken] /* must store and send back(as header on each request) to retrieve data after login */
    }

To check OTP for 2FA       
----------------
API URL: https://devbackend.dayratework.com/otpcheck
HTTP Method: POST
Post Parameters :
    {
	"email":"[EMAIL_ADDRESS]",
	"otpcode":"[OTP_CODE]", /* send in email after login */
    }
on Success Response :
    {
        status:true, 
        user:[user_data], 
        token:[authorizetoken] /* must store and send back(as header on each request) to retrieve data after login */
    }

Forgot Password      
----------------
API URL: https://devbackend.dayratework.com/forgotpassword
HTTP Method: POST
Post Parameters :
    {
	    "email":"[EMAIL_ADDRESS]",
	    "url":"https://devapp.dayratework.com/[NEW_PASSWORD_PAGE]/"
    }
on Success Response : will send Forgot update link email to user

Update New Password      
-------------------
API URL: https://devbackend.dayratework.com/forgotpassconfirmation
HTTP Method: POST
Post Parameters :
    {
	    "encdata":"[ENCRYPTED_DATA_FROM_ACTIVATION_URL]",
        "fpass":"[NEW_PASSWORD]"
    }
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

To Create Employer   
------------------
API URL: https://devbackend.dayratework.com/createemployer
HTTP Method: POST
Post Parameters :
    {
        'userid':[USER_ID], /* userid get after login */
        'firstname':[FIRST_NAME], /* These are the data to be post after create employer form submit */
        'lastname':[LAST_NAME],
        'numofemployees':[NUM_OF_EMPLOYEES],
        'companyname':[COMPANYNAME],
        'phone':[PHONE_NUMBER],
        'heardaboutus':[HEARD_ABOUT_US]
    }

on Success Response : 
    {       
        status:true,
        user:[user_data]       
    }
****NOTE: Which will create stripe customer id and updated in users table

TO Update Account Type      
-------------------
API URL: https://devbackend.dayratework.com/updateaccounttype
HTTP Method: POST
Post Parameters :
    {
	    "userid":"[USER_ID]",
        "accounttype":"[ACCOUNT_TYPE]"
    }
on Success Response : 
    {
        status:true, 
         message:[SUCCESS_MESSAGE]
    }

TO Update Email      
-------------------
API URL: https://devbackend.dayratework.com/updateemail
HTTP Method: POST
Post Parameters :
    {
	    "userid":"[USER_ID]",
        "email":"[EMAIL_ADDRESS]"
    }
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO Update Password      
-------------------
API URL: https://devbackend.dayratework.com/updateemail
HTTP Method: POST
Post Parameters :
    {
	    "userid":"[USER_ID]",
        "email":"[EMAIL_ADDRESS]",
        "npass":"[NEW_PASSWORD]",
        "opass":"[OLD_PASSWORD]"
    }
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO Update Phone      
-------------------
API URL: https://devbackend.dayratework.com/updatephone
HTTP Method: POST
Post Parameters :
    {
	    "userid":"[USER_ID]",
        "phone":"[PHONE_NUMBER]"
    }
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO Update 2FA      
-------------------
API URL: https://devbackend.dayratework.com/update2fa
HTTP Method: POST
Post Parameters :
    {
	    "userid":"[USER_ID]",
        "twofactorauth":"[2FA_TRUE_OR_FALSE]"
    }
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO Create Stripe Account ID     
-------------------
API URL: https://devbackend.dayratework.com/updatestripecard
HTTP Method: POST
Post Parameters :
    {
        "userid":[USER ID],
        "ccnumber":[CREDIT CARD NUMBER],
        "expmonth":[EXPIRE MONTH],
        "expyear":[EXPIRE YEAR],
        "cvc":[CVC],
        "firstname":"Tester",
        "lastname":"Employer",
        "address_zip":"56705",
        "address_country":"UK"
    }
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }
****NOTE: Which will create stripe account id and updated in users table

TO Create Country list      
-------------------
API URL: https://devbackend.dayratework.com/countryseed
HTTP Method: POST
Post Parameters :
    {
        "data":
        [
            {
                "country":"US"
            },
            {
                "country":"Uk"
            },
            {
                "country":"France"
            },
                {
                "country":"Spain"
            }
        ]
    }
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO List All Country   
-------------------
API URL: https://devbackend.dayratework.com/getallcountry
HTTP Method: GET
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO Create Language list      
-------------------
API URL: https://devbackend.dayratework.com/languageseed
HTTP Method: POST
Post Parameters :
    {
        "data":
        [
            {
                "language":"English"
            },
            {
                "language":"French"
            },
            {
                "language":"German"
            }
        ]
    }
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO List All Language   
-------------------
API URL: https://devbackend.dayratework.com/getalllanguage
HTTP Method: GET
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO Create Job Type list      
-------------------
API URL: https://devbackend.dayratework.com/jobtypeseed
HTTP Method: POST
Post Parameters :
    {
        "data":
        [
            {
                "jobtype":"Fixed Term Contract"
            },
            {
                "jobtype":"Temporary Contract"
            },
            {
                "jobtype":"Zero hours Contract"
            }
        ]
    }
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO List All Job Type   
-------------------
API URL: https://devbackend.dayratework.com/getalljobtype
HTTP Method: GET
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO Create Job Schedule list      
-------------------
API URL: https://devbackend.dayratework.com/jobscheduleseed
HTTP Method: POST
Post Parameters :
    {
        "data":
        [
            {
                "jobsched":"8 hours shift"
            },
            {
                "jobsched":"10 hours shift"
            },
            {
                "jobsched":"12 hours shift"
            }
        ]
    }
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO List All Job Schedule   
-------------------
API URL: https://devbackend.dayratework.com/getalljobschedule
HTTP Method: GET
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO Create Supplemental Pay list      
-------------------
API URL: https://devbackend.dayratework.com/supplementalpayseed
HTTP Method: POST
Post Parameters :
    {
        "data":
        [
            {
                "supplementalpay":"Bonus"
            },
            {
                "supplementalpay":"Tips"
            },
            {
                "supplementalpay":"Commission Pay"
            }
        ]
    }
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO List All Supplemental Pay   
-------------------
API URL: https://devbackend.dayratework.com/getallsupplementalpay
HTTP Method: GET
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO Create Benefits Offered list      
-------------------
API URL: https://devbackend.dayratework.com/benefitsofferedseed
HTTP Method: POST
Post Parameters :
   {
	"data":
	[
		{
			"benefitsoffers":"Flexitime"
		},
		{
			"benefitsoffers":"Work From Home"
		},
		{
			"benefitsoffers":"On-site Parking"
		}
	]
}
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

TO List All Benefits Offered   
-------------------
API URL: https://devbackend.dayratework.com/getallbenefitsoffered
HTTP Method: GET
on Success Response : 
    {
        status:true, 
        message:[SUCCESS_MESSAGE]
    }

To Create Job Category   
------------------
API URL: https://devbackend.dayratework.com/addjobcategory
HTTP Method: POST
Post Parameters :
    {
        "jobcategoryname":[CATEGORY NAME]"
    }

on Success Response : 
    {       
        status:true,
        user:[job_category_data]       
    }


To Edit Job Category   
------------------
API URL: https://devbackend.dayratework.com/updatejobcategory
HTTP Method: POST
Post Parameters :
    {
        "jobcatid":[JOB CATEGORY ID],
        "jobcategoryname":[JOB CATEGORY NAME]
    }

on Success Response : 
    {       
        status:true,
        user:[job_category_data]       
    }

To Delete Job Category   
------------------
API URL: https://devbackend.dayratework.com/deletejobcategory
HTTP Method: POST
Post Parameters :
    {
        "jobcatid":[JOB CATEGORY ID],
    }

on Success Response : 
    {       
        status:true,
        Message:[success message]       
    }

Get All Job Category   
------------------
API URL: https://devbackend.dayratework.com/getalljobcategory
HTTP Method: GET
Post Parameters :
    {
        "isdeleted":false
    }

on Success Response : 
    {       
        status:true,
        job:[All job category list]       
    }

Get Job Category by id 
------------------
API URL: https://devbackend.dayratework.com/getjobcategory
HTTP Method: GET
Post Parameters :
    {
        "jobcatid":[JOB CATEGORY ID],
        "isdeleted":false
    }

on Success Response : 
    {       
        status:true,
        job:[Job Category Data]       
    }

To Create Job
------------------
API URL: https://devbackend.dayratework.com/addjob
HTTP Method: POST
Post Parameters :
    {
        "country":"US",
        "language":"English",
        "companyname":"New jocks",
        "employerid":1,
        "jobtitle":"Executive",
        "locallangreq":true,
        "langtraining":true,
        "jobcategory":"Test job 1",
        "alterjobcategory":"Sales Head",
        "address":"#123 hike apts",
        "adlocation":"Roanoke, Virginia"
    }

on Success Response : 
    {       
        status:true,
        jobid:[job id]       
    }

****NOTE: This is the first step for job creation, it wil insert the data(get the inserted id) and continue with other section... After that other steps will call update API to update the data using the inserted id

To Update Job
------------------
API URL: https://devbackend.dayratework.com/updatejob
HTTP Method: POST
Post Parameters :
    {
        "jobid":1,
        "jobtype":"Fixed term contract",
        "jobschedule":"10 hours shift",
        "contractperiod":"24 Months",
        "startdate":"2022-10-01",
        "hirenumofpeople":500,
        "hiringspeed":"SAAP"
    }

on Success Response : 
    {       
        status:true,
        jobid:[job id]       
    }
****NOTE: the update API during other step after create... Also, if  there is any in data too call this update API

To Copy Job
------------------
API URL: https://devbackend.dayratework.com/copyJob
HTTP Method: POST
Post Parameters :
    {
        "jobid":[JOB ID]
    }

on Success Response : 
    {       
        status:true,        
        job:[Copied Data], 
        message:[Success Message]       
    }
****NOTE: this will copy the existing jobs

To Delete Job
------------------
API URL : https://devbackend.dayratework.com/deleteJob
HTTP Method: POST
Post Parameters :
    {
        "jobid":[JOB ID]
    }

on Success Response : 
    {       
        status:true, 
        message:[Success Message]       
    }

Get All Job
------------------
API URL: https://devbackend.dayratework.com/getalljobs
HTTP Method: GET

on Success Response : 
    {       
        status:true,
        job:[All Job Data]       
    }

Search Jobs
------------------
API URL: https://devbackend.dayratework.com/searchjobs
HTTP Method: POST

Post Parameters :
    {
        "keyword": [KEYWORD BASED ON JOBTITLE],
        "userid":[LOGGED USER ID],
        "location": [KEYWORD BASED ON LOCATION]
    }

on Success Response : 
    {       
        status:true,
        search:[All Search Data]       
    }

Get Job by id 
------------------
API URL: https://devbackend.dayratework.com/getjob
HTTP Method: GET
Post Parameters :
    {
        "jobid":[JOB ID],
        "isdeleted":false
    }

on Success Response : 
    {       
        status:true,
        job:[Job Data]       
    }

Get All Job Locations
------------------
API URL: https://devbackend.dayratework.com//getalljoblocation
HTTP Method: GET

on Success Response : 
    {       
        status:true,
        joblocations:[All Job Location Data]       
    }

