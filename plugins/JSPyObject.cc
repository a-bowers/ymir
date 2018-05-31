#include "JSPyObject.h"

Napi::FunctionReference JSPyObject::constructor;

void JSPyObject::Initialize(Napi::Env &env, Napi::Object &exports)
{
    Napi::HandleScope scope(env);
    Napi::Function ctor = DefineClass(env, "JSPyObject", {
        InstanceMethod("setAttr", &JSPyObject::setAttr), 
        InstanceMethod("getAttr", &JSPyObject::getAttr), 
        InstanceMethod("call", &JSPyObject::call), 
        InstanceMethod("valueOf", &JSPyObject::valueOf), 
        InstanceMethod("toString", &JSPyObject::toString)
    });

    constructor = Napi::Persistent(ctor);
    constructor.SuppressDestruct();

    exports.Set("JSPyObject", ctor);
}

JSPyObject::JSPyObject(const Napi::CallbackInfo &info) : ObjectWrap<JSPyObject>(info)
{
    this->__py_object = info[0].As<Napi::External<PyObject>>().Data();
}

JSPyObject::~JSPyObject()
{
    PyThreadStateLock py_thread_lock;
    Py_XDECREF(__py_object);
    __py_object = NULL;
}

// Handle this differently
Napi::Value JSPyObject::toString(const Napi::CallbackInfo &args)
{
    PyThreadStateLock lock;
    PyObject * pyStr = PyObject_Type(this->__py_object);
    std::string pyObjectStr = "Python Value(";
    pyObjectStr += PyString_AS_STRING(PyObject_Str(pyStr));
    pyObjectStr += ")";
    Py_XDECREF(pyStr);
    return Napi::String::New(args.Env(), pyObjectStr);
}

Napi::Value JSPyObject::getAttr(const Napi::CallbackInfo &args)
{
    PyThreadStateLock py_thread_lock;

    Napi::Env env = args.Env();
    std::string attrName = args[0].As<Napi::String>();
    PyObject *objAttribute = PyObject_GetAttrString(
        this->__py_object, attrName.c_str());

    return WrapPyObject(env, objAttribute);
}

Napi::Value JSPyObject::setAttr(const Napi::CallbackInfo &args)
{
    PyThreadStateLock lock;
    Napi::Env env = args.Env();

    std::string key = args[0].As<Napi::String>().Utf8Value();
    PyObject *pyValue = JSToPython(args[1]);
    PyObject *pyKey = PyString_InternFromString(key.c_str());
    PyObject_SetItem(this->__py_object, pyKey, pyValue);

    return env.Undefined();
}

Napi::Value JSPyObject::valueOf(const Napi::CallbackInfo &args)
{
    PyThreadStateLock lock;
    Napi::Env env = args.Env();

    return PythonToJS(env, this->__py_object);
}

Napi::Value JSPyObject::call(const Napi::CallbackInfo &args)
{
    PyThreadStateLock py_thread_lock;
    Napi::Env env = args.Env();
    // FryCatch catcher(env);

    size_t argc = args.Length();
    PyObject *pyArgs = PyTuple_New(args.Length());

    for (int i = 0; i < argc; i++)
    {
        PyObject *value = JSToPython(args[i]);
        if (value == NULL)
        {
            Napi::TypeError::New(args.Env(), "Cannot safely call this function")
                .ThrowAsJavaScriptException();
            return args.Env().Undefined();
        }
        PyTuple_SET_ITEM(pyArgs, i, value);
    }

    PyObject *response = PyObject_Call(this->__py_object, pyArgs, NULL);

    Py_XDECREF(pyArgs);

    return WrapPyObject(env, response);
}

/** 
 * 
 * Simple wrapper for PythonToJS, This returns the lower level PyObject
 * we will convert all basic types, because we can then perform operations
 * faster in JS / Python land. We should only cross the bridges when they
 * are absolutely necessary. Unfortunately this will increase some complexity
 * with sources of truth. 
 * 
 * Maybe there is a better way to these things, but I am not sure what 
 * that would be
 */
Napi::Value JSPyObject::PythonToJS(const Napi::Env &env, PyObject *obj)
{
    PyThreadStateLock lock;
    // FryCatch fry(env);

    if (obj == NULL)
    {
        return env.Null();
    }

    if (Py_None == obj)
    {
        return env.Undefined();
    }

    // if (PyCallable_Check) {

    // }
    // Is this safe ?
    if (PyInt_CheckExact(obj) == TRUE)
    {
        return Napi::Number::New(env, PyInt_AS_LONG(obj));
    }

    if (PyFloat_CheckExact(obj) == TRUE)
    {
        return Napi::Number::New(env, PyFloat_AS_DOUBLE(obj));
    }

    // @TODO: PyLONG
    // @TODO: end

    if (PyBool_Check(obj) == TRUE)
    {
        bool temp = Py_True == obj;
        return Napi::Boolean::New(env, temp);
    }

    if (PyByteArray_CheckExact(obj) == TRUE)
    {
        size_t pyBufLen = PyByteArray_GET_SIZE(obj);
        char *pyBuf = PyByteArray_AS_STRING(obj);
        Napi::Buffer<char> buf = Napi::Buffer<char>::Copy(env, pyBuf, pyBufLen);
        return buf;
    }

    if (PyString_CheckExact(obj) == TRUE)
    {
        std::string str = PyString_AsString(obj);
        Napi::String jsStr = Napi::String::New(env, str);
        return jsStr;
    }

    if (PyList_Check(obj) == TRUE || PyTuple_Check(obj) == TRUE)
    {
        size_t length = PySequence_Length(obj);
        Napi::Array arr = Napi::Array::New(env, length);
        for (int i = 0; i < length; i++)
        {
            arr.Set(i, WrapPyObject(env, PySequence_GetItem(obj, i)));
        }
        return arr;
    }

    return WrapPyObject(env, obj);
}

Napi::Value JSPyObject::WrapPyObject(const Napi::Env &env, PyObject *obj)
{
    if (obj == NULL)
    {
        return env.Undefined();
    }
    return JSPyObject::constructor.New({Napi::External<PyObject>::New(env, obj)});
}
/**
 * 
 * @TODO: Improve some type of wrapping here for better life-cycle 
 * management 
 */
PyObject *JSPyObject::JSToPython(const Napi::Value &jsRef)
{
    PyThreadStateLock lock;
    // FryCatch fry(jsRef.Env());
    // This method must be called from JavaScript
    // We need a better way to wrap this to ensure
    // Interpolability
    if (jsRef.IsPromise())
    {
        Napi::TypeError::New(jsRef.Env(), "Cannot convert promise to python, yet")
            .ThrowAsJavaScriptException();
        return NULL;
    }

    if (jsRef.IsUndefined())
    {
        Py_RETURN_NONE;
    }

    if (jsRef.IsNull())
    {
        return NULL;
    }

    // Maybe we shouldn't return this
    if (jsRef.IsString())
    {
        std::string str = jsRef.As<Napi::String>();
        PyObject *pyUnicodeStr = PyUnicodeUCS2_FromString(str.c_str());
        return pyUnicodeStr;
    }

    if (jsRef.IsBoolean())
    {
        bool boolean = jsRef.ToBoolean().Value();
        if (boolean == true)
        {
            Py_RETURN_TRUE;
        }
        Py_RETURN_FALSE;
    }

    /**
     * Madness this is madness,
     * Madness, this ... is ... scrpting!
     */
    if (jsRef.IsNumber())
    {
        Napi::Number num = jsRef.As<Napi::Number>();
        PyObject *pyNum;
        int64_t intValue = num.Int64Value();
        double_t doubleValue = num.DoubleValue();

        // We have an int, and we have just wasted a few CPU cycles
        if (((double_t)intValue) == doubleValue)
        {
            pyNum = PyInt_FromSize_t(num.Int64Value());
        }
        else
        {
            pyNum = PyFloat_FromDouble(doubleValue);
        }

        return pyNum;
    }

    // @TODO: Test if this is the best way to do it
    // or if this can be done in a more efficient
    // faster manner
    if (jsRef.IsArrayBuffer() || jsRef.IsBuffer())
    {
        Napi::ArrayBuffer arrayBuf = (jsRef.IsBuffer()
                                          ? jsRef.As<Napi::Buffer<uint8_t>>().ArrayBuffer()
                                          : jsRef)
                                         .As<Napi::ArrayBuffer>();

        auto len = arrayBuf.ByteLength();
        auto buf = arrayBuf.Data();

        PyObject *pyBuf = PyBuffer_FromMemory(buf, len);
        return pyBuf;
    }

    // If this is a PyObject, try capture it
    if (jsRef.IsExternal())
    {
        if (X_JS_INSTANCE_OF(jsRef, JSPyObject))
        {
            JSPyObject *cref = jsRef.As<Napi::External<JSPyObject>>().Data();
            return cref->__py_object;
        }

        Napi::TypeError::New(jsRef.Env(), "Cannot convert external c objects to python, you should extend this class if you really want to")
            .ThrowAsJavaScriptException();
        return NULL;
    }

    if (jsRef.IsFunction())
    {
        Napi::Function func = jsRef.As<Napi::Function>();
        PyMethodDef * pyMethodDef = new PyMethodDef();
        std::string jsMethodName = func.Get("name").ToString();

        pyMethodDef->ml_name  = strdup(jsMethodName.c_str());
        pyMethodDef->ml_meth  = (PyCFunction) CallJSFunction;
        pyMethodDef->ml_flags = METH_VARARGS;
        pyMethodDef->ml_doc   = strdup("ExternalJavaScriptMethod");

        PyObject * funcRef = PyCObject_FromVoidPtr((void *) &func, NULL);
        PyObject * pyFunc  = PyCFunction_New(pyMethodDef, funcRef);
        Py_TYPE(pyFunc) = &PyCFunction_Type;

        return pyFunc;
    }

    // Only do this for very native arrays
    if (jsRef.IsArray())
    {
        auto jsArray = jsRef.As<Napi::Array>();
        auto len = jsArray.Length();
        PyObject *pyArray = PyList_New(len);
        for (auto i = 0; i < len; i++)
        {
            PyList_SetItem(pyArray, i, JSToPython(jsArray.Get(i)));
        }
        return pyArray;
    }

    // Only do this for very native dicts
    if (jsRef.IsObject())
    {
        Napi::Object jsObject = jsRef.As<Napi::Object>();
        Napi::Array keys = jsObject.GetPropertyNames();
        size_t len = keys.Length();
        PyObject *pyDict = PyDict_New();
        for (auto i = 0; i < len; i++)
        {
            auto key = keys.Get(i).ToString().Utf8Value();
            auto value = jsObject.Get(key);
            PyDict_SetItemString(pyDict, key.c_str(), JSToPython(value));
        }
        return pyDict;
    }

    Napi::TypeError::New(jsRef.Env(), "Cannot convert unknown yet")
        .ThrowAsJavaScriptException();
}

PyObject * JSPyObject::CallJSFunction(PyObject * self, PyObject * args)
{
    PyThreadStateLock lock;

    int64_t argc = PySequence_Length(args);
    std::vector<Napi::Value> argv(argc);

    Napi::Function func = *((Napi::Function *) PyCObject_AsVoidPtr(self));

    Napi::Env env = func.Env();
    // FryCatch fry(env);

    for (int i = 0; i < argc; i++)
    {
        PyObject *pyArg = PySequence_GetItem(args, i);
        argv[i] = JSPyObject::PythonToJS(env, pyArg);
    }

    // Napi::Array argv = PythonToJS(func->Env(), args).As<Napi::Array>();
    return JSToPython(func.Call({
        argv[0],
        argv[1]
    }));
}